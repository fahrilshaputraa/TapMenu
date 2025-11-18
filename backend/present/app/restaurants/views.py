from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .models import Restaurant, RestaurantTheme, OperatingHours, RestaurantSettings
from .serializers import (
    RestaurantListSerializer, RestaurantDetailSerializer,
    RestaurantCreateSerializer, RestaurantUpdateSerializer,
    RestaurantPublicSerializer, RestaurantThemeSerializer,
    OperatingHoursSerializer, RestaurantSettingsSerializer
)
from app.account.permissions import IsAdmin, IsStaff


class RestaurantViewSet(viewsets.ModelViewSet):
    """ViewSet for restaurant management."""

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.user_type == 'admin':
            # Admin sees their owned restaurants
            return Restaurant.objects.filter(owner=user)
        elif user.is_restaurant_staff:
            # Staff sees restaurants they belong to
            restaurant_ids = user.staff_profiles.filter(
                status='active'
            ).values_list('restaurant_id', flat=True)
            return Restaurant.objects.filter(id__in=restaurant_ids)
        else:
            return Restaurant.objects.none()

    def get_serializer_class(self):
        if self.action == 'list':
            return RestaurantListSerializer
        elif self.action == 'create':
            return RestaurantCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return RestaurantUpdateSerializer
        return RestaurantDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

    @extend_schema(
        request=RestaurantThemeSerializer,
        responses={200: RestaurantThemeSerializer},
        description='Get or update restaurant theme'
    )
    @action(detail=True, methods=['get', 'put', 'patch'])
    def theme(self, request, pk=None):
        """Get or update restaurant theme."""
        restaurant = self.get_object()

        if request.method == 'GET':
            try:
                theme = restaurant.theme
                return Response(RestaurantThemeSerializer(theme).data)
            except RestaurantTheme.DoesNotExist:
                return Response(
                    {'error': 'Theme not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

        # PUT/PATCH
        try:
            theme = restaurant.theme
        except RestaurantTheme.DoesNotExist:
            theme = RestaurantTheme.objects.create(restaurant=restaurant)

        serializer = RestaurantThemeSerializer(
            theme,
            data=request.data,
            partial=request.method == 'PATCH'
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @extend_schema(
        request=OperatingHoursSerializer(many=True),
        responses={200: OperatingHoursSerializer(many=True)},
        description='Get or update operating hours'
    )
    @action(detail=True, methods=['get', 'put'])
    def operating_hours(self, request, pk=None):
        """Get or update operating hours."""
        restaurant = self.get_object()

        if request.method == 'GET':
            hours = restaurant.operating_hours.all()
            return Response(OperatingHoursSerializer(hours, many=True).data)

        # PUT - expects list of all 7 days
        serializer = OperatingHoursSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)

        # Delete existing and create new
        restaurant.operating_hours.all().delete()
        for hour_data in serializer.validated_data:
            OperatingHours.objects.create(restaurant=restaurant, **hour_data)

        hours = restaurant.operating_hours.all()
        return Response(OperatingHoursSerializer(hours, many=True).data)

    @extend_schema(
        request=RestaurantSettingsSerializer,
        responses={200: RestaurantSettingsSerializer},
        description='Get or update restaurant settings'
    )
    @action(detail=True, methods=['get', 'put', 'patch'])
    def settings(self, request, pk=None):
        """Get or update restaurant settings."""
        restaurant = self.get_object()

        if request.method == 'GET':
            try:
                settings = restaurant.settings
                return Response(RestaurantSettingsSerializer(settings).data)
            except RestaurantSettings.DoesNotExist:
                return Response(
                    {'error': 'Settings not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

        # PUT/PATCH
        try:
            settings = restaurant.settings
        except RestaurantSettings.DoesNotExist:
            settings = RestaurantSettings.objects.create(restaurant=restaurant)

        serializer = RestaurantSettingsSerializer(
            settings,
            data=request.data,
            partial=request.method == 'PATCH'
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_open(self, request, pk=None):
        """Toggle restaurant open/closed status."""
        restaurant = self.get_object()
        restaurant.is_open = not restaurant.is_open
        restaurant.save()
        return Response({
            'is_open': restaurant.is_open,
            'message': f"Restaurant is now {'open' if restaurant.is_open else 'closed'}"
        })


class PublicRestaurantViewSet(viewsets.ReadOnlyModelViewSet):
    """Public ViewSet for customer-facing restaurant data."""

    queryset = Restaurant.objects.filter(status='active')
    serializer_class = RestaurantPublicSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    @action(detail=True, methods=['get'])
    def menu(self, request, slug=None):
        """Get restaurant menu (categories and products)."""
        restaurant = self.get_object()

        categories = restaurant.categories.filter(is_active=True)
        products = restaurant.products.filter(is_active=True, is_available=True)

        from app.menu.serializers import CategorySerializer, ProductDetailSerializer

        return Response({
            'categories': CategorySerializer(categories, many=True).data,
            'products': ProductDetailSerializer(products, many=True).data
        })
