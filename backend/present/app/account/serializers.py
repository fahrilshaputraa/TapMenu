from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import StaffProfile, CustomerProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""

    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'phone', 'avatar',
            'user_type', 'is_active', 'is_verified',
            'created_at', 'last_login'
        ]
        read_only_fields = ['id', 'created_at', 'last_login']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new users."""

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'email', 'full_name', 'phone', 'password', 'password_confirm',
            'user_type'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password': 'Password fields do not match.'
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class StaffRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for staff registration (Admin creating restaurant)."""

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)
    restaurant_name = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'email', 'full_name', 'phone', 'password', 'password_confirm',
            'restaurant_name'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password': 'Password fields do not match.'
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        restaurant_name = validated_data.pop('restaurant_name')

        # Create user as admin
        user = User.objects.create_user(
            user_type='admin',
            is_staff=True,
            **validated_data
        )

        # Create restaurant (will be handled in view)
        self.context['restaurant_name'] = restaurant_name

        return user


class CustomerRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for customer registration."""

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'email', 'full_name', 'phone', 'password', 'password_confirm'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password': 'Password fields do not match.'
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            user_type='customer',
            **validated_data
        )
        # Create customer profile
        CustomerProfile.objects.create(user=user)
        return user


class StaffProfileSerializer(serializers.ModelSerializer):
    """Serializer for StaffProfile model."""

    user = UserSerializer(read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)

    class Meta:
        model = StaffProfile
        fields = [
            'id', 'user', 'restaurant', 'restaurant_name', 'role', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StaffInviteSerializer(serializers.Serializer):
    """Serializer for inviting staff members."""

    email = serializers.EmailField(required=True)
    full_name = serializers.CharField(required=True)
    role = serializers.ChoiceField(choices=['kasir', 'kitchen'])

    def validate_email(self, value):
        # Check if user already exists in this restaurant
        restaurant = self.context.get('restaurant')
        if StaffProfile.objects.filter(
            user__email=value,
            restaurant=restaurant
        ).exists():
            raise serializers.ValidationError(
                'This user is already a staff member of this restaurant.'
            )
        return value


class CustomerProfileSerializer(serializers.ModelSerializer):
    """Serializer for CustomerProfile model."""

    user = UserSerializer(read_only=True)

    class Meta:
        model = CustomerProfile
        fields = [
            'id', 'user', 'preferred_language', 'dietary_preferences',
            'total_orders', 'total_spent', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'total_orders', 'total_spent', 'created_at', 'updated_at']


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password."""

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password': 'Password fields do not match.'
            })
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect.')
        return value


class LoginSerializer(serializers.Serializer):
    """Serializer for login."""

    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
