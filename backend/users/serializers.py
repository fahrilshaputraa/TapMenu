import random
import string
from datetime import timedelta

from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, UserRole


def generate_tokens_for_user(user: User) -> dict[str, str]:
    """Generate refresh/access token pair for a user."""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'full_name',
            'phone_number',
            'role',
            'is_active',
            'is_staff',
        )
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=UserRole.choices, default=UserRole.BUYER)

    class Meta:
        model = User
        fields = ('email', 'password', 'full_name', 'phone_number', 'role')

    def validate_role(self, value):
        if value == UserRole.OWNER and not self.context.get('allow_owner', True):
            raise serializers.ValidationError(_('Owner registration is currently disabled.'))
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            request=self.context.get('request'),
            email=attrs.get('email'),
            password=attrs.get('password'),
        )
        if not user:
            raise serializers.ValidationError(_('Invalid credentials.'), code='authorization')
        if not user.is_active:
            raise serializers.ValidationError(_('User account is disabled.'), code='authorization')
        attrs['user'] = user
        return attrs


class TokenPairSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    access = serializers.CharField()


class AuthResponseSerializer(serializers.Serializer):
    user = UserSerializer()
    tokens = TokenPairSerializer()


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def generate_token(self):
        """Generate 6-digit random token."""
        return ''.join(random.choices(string.digits, k=6))

    def save(self, **kwargs):
        """Generate token 6 digit dan kirim ke email."""
        email = self.validated_data.get('email')
        try:
            user = User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            # Silent fail untuk security (tidak kasih tau email tidak ada)
            return email

        # Generate token 6 digit
        token = self.generate_token()
        user.reset_token = token
        user.reset_token_created_at = timezone.now()
        user.save(update_fields=['reset_token', 'reset_token_created_at'])

        # Kirim email dengan token dan link
        reset_url = f"{settings.FRONTEND_URL}/reset-password?email={email}"
        subject = 'Reset Password - TapMenu'
        message = f"""Halo {user.full_name or user.email},

Anda menerima email ini karena ada permintaan reset password untuk akun TapMenu Anda.

Kode Verifikasi: {token}

Kode ini berlaku selama 15 menit.

Atau klik link berikut untuk langsung ke halaman reset password:
{reset_url}

Jika Anda tidak meminta reset password, abaikan email ini.

Salam,
Tim TapMenu
"""
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        return email


class PasswordResetVerifyTokenSerializer(serializers.Serializer):
    """Serializer untuk validasi token saja (step 2)."""
    email = serializers.EmailField()
    token = serializers.CharField(max_length=6, min_length=6)

    def validate(self, attrs):
        email = attrs.get('email')
        token = attrs.get('token')

        try:
            user = User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            raise serializers.ValidationError(_('Invalid email or token.'))

        # Cek apakah token ada dan cocok
        if not user.reset_token or user.reset_token != token:
            raise serializers.ValidationError(_('Invalid token.'))

        # Cek apakah token sudah expired (15 menit)
        if not user.reset_token_created_at:
            raise serializers.ValidationError(_('Token has expired.'))

        token_age = timezone.now() - user.reset_token_created_at
        if token_age > timedelta(minutes=15):
            raise serializers.ValidationError(_('Token has expired. Please request a new one.'))

        attrs['user'] = user
        return attrs


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer untuk reset password (step 3)."""
    email = serializers.EmailField()
    token = serializers.CharField(max_length=6, min_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        email = attrs.get('email')
        token = attrs.get('token')

        try:
            user = User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            raise serializers.ValidationError(_('Invalid email or token.'))

        # Cek apakah token ada dan cocok
        if not user.reset_token or user.reset_token != token:
            raise serializers.ValidationError(_('Invalid token.'))

        # Cek apakah token sudah expired (15 menit)
        if not user.reset_token_created_at:
            raise serializers.ValidationError(_('Token has expired.'))

        token_age = timezone.now() - user.reset_token_created_at
        if token_age > timedelta(minutes=15):
            raise serializers.ValidationError(_('Token has expired. Please request a new one.'))

        attrs['user'] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        # Clear token setelah digunakan
        user.reset_token = None
        user.reset_token_created_at = None
        user.save(update_fields=['password', 'reset_token', 'reset_token_created_at'])
        return user
