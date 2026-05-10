from rest_framework import serializers

from restaurants.utils import require_user_restaurant

from .models import Category, MenuItem


class CategorySerializer(serializers.ModelSerializer):
    menu_count = serializers.IntegerField(source='items.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'sort_order', 'is_active', 'menu_count']


class MenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    in_stock = serializers.SerializerMethodField()
    effective_price = serializers.SerializerMethodField()
    image_url = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = MenuItem
        fields = [
            'id',
            'category',
            'category_name',
            'name',
            'sku',
            'description',
            'price',
            'discount_percentage',
            'tax_percentage',
            'effective_price',
            'image_url',
            'track_stock',
            'stock_quantity',
            'preparation_time_minutes',
            'is_available',
            'is_featured',
            'is_new',
            'variants',
            'in_stock',
        ]

    def get_in_stock(self, obj):
        return obj.in_stock

    def get_effective_price(self, obj):
        return obj.effective_price

    def validate_category(self, value):
        request = self.context['request']
        restaurant = require_user_restaurant(request.user)
        if value.restaurant_id != restaurant.id:
            raise serializers.ValidationError('Category does not belong to your restaurant.')
        return value

    def validate_discount_percentage(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError('Discount must be between 0 and 100.')
        return value

    def validate_tax_percentage(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError('Tax must be between 0 and 100.')
        return value

    def validate_variants(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('Variants must be a list.')
        return value
