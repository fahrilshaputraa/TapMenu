from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import (
    AuthResponseSerializer,
    LoginSerializer,
    LogoutSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserSerializer,
    generate_tokens_for_user,
)

User = get_user_model()


@extend_schema(
    tags=['Auth'],
    request=RegisterSerializer,
    responses={201: AuthResponseSerializer},
)
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = generate_tokens_for_user(user)
        return Response(
            {'user': UserSerializer(user).data, 'tokens': tokens},
            status=status.HTTP_201_CREATED,
        )


@extend_schema(
    tags=['Auth'],
    request=LoginSerializer,
    responses={200: AuthResponseSerializer},
)
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        tokens = generate_tokens_for_user(user)
        return Response({'user': UserSerializer(user).data, 'tokens': tokens})


@extend_schema(
    tags=['Auth'],
    request=LogoutSerializer,
    responses={200: OpenApiResponse(description='Successfully logged out.')},
)
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'detail': _('Refresh token is required.')},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {'detail': _('Invalid or expired token.')},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({'detail': _('Successfully logged out.')}, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Auth'],
    request=PasswordResetRequestSerializer,
    responses={200: OpenApiResponse(description='Reset link dispatched if email exists.')},
)
class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(
            data=request.data,
            context={'request': request, 'use_https': request.is_secure()},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'detail': _('If the email exists, a reset link has been sent.')},
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=['Auth'],
    request=PasswordResetConfirmSerializer,
    responses={200: OpenApiResponse(description='Password reset successfully.')},
)
class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'detail': _('Password has been reset successfully.')},
            status=status.HTTP_200_OK,
        )


class RefreshTokenView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(tags=['Auth'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
