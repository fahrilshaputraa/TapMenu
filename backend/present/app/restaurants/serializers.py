from rest_framework import serializers
from .models import Restaurant, RestaurantTheme, OperatingHours, RestaurantSettings


class RestaurantThemeSerializer(serializers.ModelSerializer):
    """Serializer for RestaurantTheme model."""

    class Meta:
        model = RestaurantTheme
        fields = [
            'id', 'primary_color', 'secondary_color', 'accent_color',
            'background_color', 'text_color', 'font_family', 'menu_layout',
            'custom_css', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class OperatingHoursSerializer(serializers.ModelSerializer):
    """Serializer for OperatingHours model."""

    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)

    class Meta:
        model = OperatingHours
        fields = [
            'id', 'day_of_week', 'day_name', 'open_time', 'close_time', 'is_closed'
        ]
        read_only_fields = ['id']


class RestaurantSettingsSerializer(serializers.ModelSerializer):
    """Serializer for RestaurantSettings model."""

    class Meta:
        model = RestaurantSettings
        fields = [
            'id', 'auto_accept_orders', 'require_table_number',
            'allow_takeaway', 'allow_dine_in', 'payment_methods',
            'min_order_amount', 'email_notifications', 'sms_notifications',
            'receipt_header', 'receipt_footer', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class RestaurantListSerializer(serializers.ModelSerializer):
    """Serializer for listing restaurants (minimal data)."""

    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'slug', 'logo', 'city', 'is_open', 'status'
        ]


class RestaurantDetailSerializer(serializers.ModelSerializer):
    """Serializer for restaurant details."""

    theme = RestaurantThemeSerializer(read_only=True)
    operating_hours = OperatingHoursSerializer(many=True, read_only=True)
    settings = RestaurantSettingsSerializer(read_only=True)
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)

    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'slug', 'description', 'logo', 'banner',
            'owner', 'owner_name', 'email', 'phone', 'website',
            'address', 'city', 'province', 'postal_code',
            'latitude', 'longitude', 'currency', 'tax_rate',
            'service_charge', 'status', 'is_open',
            'theme', 'operating_hours', 'settings',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'owner', 'created_at', 'updated_at']


class RestaurantCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a restaurant."""

    class Meta:
        model = Restaurant
        fields = [
            'name', 'description', 'logo', 'banner',
            'email', 'phone', 'website', 'address', 'city',
            'province', 'postal_code', 'latitude', 'longitude',
            'currency', 'tax_rate', 'service_charge'
        ]

    def create(self, validated_data):
        # Set owner from request user
        validated_data['owner'] = self.context['request'].user
        restaurant = super().create(validated_data)

        # Create default theme
        RestaurantTheme.objects.create(restaurant=restaurant)

        # Create default settings
        RestaurantSettings.objects.create(
            restaurant=restaurant,
            payment_methods=['cash', 'qris']
        )

        # Create default operating hours (9 AM - 10 PM, 7 days)
        for day in range(7):
            OperatingHours.objects.create(
                restaurant=restaurant,
                day_of_week=day,
                open_time='09:00',
                close_time='22:00',
                is_closed=False
            )

        return restaurant


class RestaurantUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating a restaurant."""

    class Meta:
        model = Restaurant
        fields = [
            'name', 'description', 'logo', 'banner',
            'email', 'phone', 'website', 'address', 'city',
            'province', 'postal_code', 'latitude', 'longitude',
            'currency', 'tax_rate', 'service_charge', 'is_open'
        ]


class RestaurantPublicSerializer(serializers.ModelSerializer):
    """Serializer for public restaurant view (customer-facing)."""

    theme = RestaurantThemeSerializer(read_only=True)
    operating_hours = OperatingHoursSerializer(many=True, read_only=True)

    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'slug', 'description', 'logo', 'banner',
            'phone', 'address', 'city', 'currency', 'tax_rate',
            'service_charge', 'is_open', 'theme', 'operating_hours'
        ]
