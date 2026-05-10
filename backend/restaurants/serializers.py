from rest_framework import serializers

from .models import Restaurant, RestaurantAppearance


class RestaurantAppearanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantAppearance
        fields = (
            'hero_title',
            'hero_subtitle',
            'primary_color',
            'accent_color',
            'logo_url',
            'cover_image_url',
        )


class RestaurantSerializer(serializers.ModelSerializer):
    appearance = RestaurantAppearanceSerializer(required=False)

    class Meta:
        model = Restaurant
        fields = (
            'id',
            'name',
            'slug',
            'description',
            'email',
            'phone_number',
            'address',
            'currency',
            'tax_rate',
            'service_charge_rate',
            'cash_enabled',
            'qris_enabled',
            'qris_label',
            'qris_static_payload',
            'is_open',
            'opening_time',
            'closing_time',
            'operational_days',
            'appearance',
        )
        read_only_fields = ('id',)

    def create(self, validated_data):
        appearance_data = validated_data.pop('appearance', None)
        request = self.context['request']
        restaurant = Restaurant.objects.create(owner=request.user, **validated_data)
        request.user.restaurant = restaurant
        request.user.save(update_fields=['restaurant'])
        RestaurantAppearance.objects.update_or_create(
            restaurant=restaurant,
            defaults=appearance_data or {},
        )
        return restaurant

    def update(self, instance, validated_data):
        appearance_data = validated_data.pop('appearance', None)

        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        if appearance_data is not None:
            RestaurantAppearance.objects.update_or_create(
                restaurant=instance,
                defaults=appearance_data,
            )
        return instance