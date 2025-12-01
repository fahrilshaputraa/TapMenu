from django.contrib.auth import authenticate
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str, force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
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

    def save(self, **kwargs):
        """Send password reset email via Django's PasswordResetForm."""
        form = PasswordResetForm(data=self.validated_data)
        if form.is_valid():
            form.save(
                request=self.context.get('request'),
                use_https=self.context.get('use_https', False),
                token_generator=default_token_generator,
                from_email=None,
                email_template_name='registration/password_reset_email.html',
            )
        return self.validated_data.get('email')


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        try:
            user_id = force_str(urlsafe_base64_decode(attrs['uid']))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            raise serializers.ValidationError(_('Invalid reset link.'))

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError(_('Invalid or expired reset token.'))

        attrs['user'] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user

    @staticmethod
    def build_token_payload(user: User) -> dict[str, str]:
        """Helper to build uid/token pair for a user (useful for tests)."""
        return {
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': default_token_generator.make_token(user),
        }
