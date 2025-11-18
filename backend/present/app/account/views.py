from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .models import StaffProfile, CustomerProfile
from .serializers import (
    UserSerializer, UserCreateSerializer, StaffRegistrationSerializer,
    CustomerRegistrationSerializer, StaffProfileSerializer, StaffInviteSerializer,
    CustomerProfileSerializer, ChangePasswordSerializer, LoginSerializer
)
from .permissions import IsAdmin, IsStaff
from app.restaurants.models import Restaurant

User = get_user_model()


class AuthViewSet(viewsets.ViewSet):
    """ViewSet for authentication endpoints."""

    permission_classes = [AllowAny]

    @extend_schema(
        request=StaffRegistrationSerializer,
        responses={201: OpenApiResponse(description='Staff registered successfully')},
        description='Register a new restaurant admin with their restaurant'
    )
    @action(detail=False, methods=['post'])
    def register_staff(self, request):
        """Register a new restaurant admin with their restaurant."""
        serializer = StaffRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Create restaurant
        restaurant = Restaurant.objects.create(
            name=serializer.context['restaurant_name'],
            owner=user
        )

        # Create staff profile
        StaffProfile.objects.create(
            user=user,
            restaurant=restaurant,
            role='admin',
            status='active'
        )

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'restaurant': {
                'id': restaurant.id,
                'name': restaurant.name,
                'slug': restaurant.slug
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
        }, status=status.HTTP_201_CREATED)

    @extend_schema(
        request=CustomerRegistrationSerializer,
        responses={201: OpenApiResponse(description='Customer registered successfully')},
        description='Register a new customer'
    )
    @action(detail=False, methods=['post'])
    def register_customer(self, request):
        """Register a new customer."""
        serializer = CustomerRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
        }, status=status.HTTP_201_CREATED)

    @extend_schema(
        request=LoginSerializer,
        responses={200: OpenApiResponse(description='Login successful')},
        description='Login user and return JWT tokens'
    )
    @action(detail=False, methods=['post'])
    def login(self, request):
        """Login user and return tokens."""
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.check_password(password):
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {'error': 'Account is disabled'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        # Get staff profiles if staff user
        staff_profiles = []
        if user.is_restaurant_staff:
            profiles = StaffProfile.objects.filter(user=user, status='active')
            staff_profiles = StaffProfileSerializer(profiles, many=True).data

        return Response({
            'user': UserSerializer(user).data,
            'staff_profiles': staff_profiles,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
        })

    @extend_schema(
        responses={200: UserSerializer},
        description='Get current authenticated user info'
    )
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current user info."""
        user = request.user
        data = UserSerializer(user).data

        # Add staff profiles if staff user
        if user.is_restaurant_staff:
            profiles = StaffProfile.objects.filter(user=user, status='active')
            data['staff_profiles'] = StaffProfileSerializer(profiles, many=True).data

        # Add customer profile if customer
        if user.user_type == 'customer':
            try:
                profile = CustomerProfile.objects.get(user=user)
                data['customer_profile'] = CustomerProfileSerializer(profile).data
            except CustomerProfile.DoesNotExist:
                pass

        return Response(data)

    @extend_schema(
        request=ChangePasswordSerializer,
        responses={200: OpenApiResponse(description='Password changed successfully')},
        description='Change user password'
    )
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        """Change user password."""
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({'message': 'Password changed successfully'})

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """Logout user (blacklist refresh token)."""
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logged out successfully'})
        except Exception:
            return Response({'message': 'Logged out'})


class StaffViewSet(viewsets.ModelViewSet):
    """ViewSet for managing staff members."""

    serializer_class = StaffProfileSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        return StaffProfile.objects.filter(restaurant_id=restaurant_id)

    @extend_schema(
        request=StaffInviteSerializer,
        responses={201: StaffProfileSerializer},
        description='Invite a new staff member to restaurant'
    )
    @action(detail=False, methods=['post'])
    def invite(self, request, restaurant_id=None):
        """Invite a new staff member."""
        serializer = StaffInviteSerializer(
            data=request.data,
            context={'restaurant': Restaurant.objects.get(id=restaurant_id)}
        )
        serializer.is_valid(raise_exception=True)

        # Check if user exists
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Create new user
            user = User.objects.create_user(
                email=email,
                password=None,  # Will be set on invitation accept
                full_name=serializer.validated_data['full_name'],
                user_type=serializer.validated_data['role'],
                is_active=False
            )

        # Create staff profile
        import secrets
        staff_profile = StaffProfile.objects.create(
            user=user,
            restaurant_id=restaurant_id,
            role=serializer.validated_data['role'],
            status='invited',
            invitation_token=secrets.token_urlsafe(32)
        )

        # TODO: Send invitation email

        return Response(
            StaffProfileSerializer(staff_profile).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def deactivate(self, request, restaurant_id=None, pk=None):
        """Deactivate a staff member."""
        staff_profile = self.get_object()
        staff_profile.status = 'inactive'
        staff_profile.save()
        return Response(StaffProfileSerializer(staff_profile).data)

    @action(detail=True, methods=['post'])
    def activate(self, request, restaurant_id=None, pk=None):
        """Activate a staff member."""
        staff_profile = self.get_object()
        staff_profile.status = 'active'
        staff_profile.save()
        return Response(StaffProfileSerializer(staff_profile).data)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """View for user profile management."""

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
