from rest_framework import serializers
from .models import Category, Product, ProductVariant, ProductAddon, Tax, Discount


class ProductVariantSerializer(serializers.ModelSerializer):
    """Serializer for ProductVariant model."""

    class Meta:
        model = ProductVariant
        fields = [
            'id', 'name', 'price_adjustment', 'is_available', 'sort_order'
        ]
        read_only_fields = ['id']


class ProductAddonSerializer(serializers.ModelSerializer):
    """Serializer for ProductAddon model."""

    class Meta:
        model = ProductAddon
        fields = [
            'id', 'name', 'price', 'is_available', 'sort_order'
        ]
        read_only_fields = ['id']


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""

    products_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'description', 'image', 'sort_order',
            'is_active', 'products_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for listing products."""

    category_name = serializers.CharField(source='category.name', read_only=True)
    current_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'image', 'price', 'discount_price',
            'current_price', 'category', 'category_name', 'is_available',
            'is_featured', 'tags', 'preparation_time'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer for product details."""

    category_name = serializers.CharField(source='category.name', read_only=True)
    current_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    variants = ProductVariantSerializer(many=True, read_only=True)
    addons = ProductAddonSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'image', 'price', 'discount_price',
            'current_price', 'category', 'category_name', 'is_available',
            'stock_quantity', 'track_stock', 'preparation_time', 'calories',
            'tags', 'sort_order', 'is_featured', 'is_active',
            'variants', 'addons', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProductCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating products."""

    variants = ProductVariantSerializer(many=True, required=False)
    addons = ProductAddonSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'image', 'price', 'discount_price',
            'category', 'is_available', 'stock_quantity', 'track_stock',
            'preparation_time', 'calories', 'tags', 'sort_order',
            'is_featured', 'is_active', 'variants', 'addons'
        ]

    def create(self, validated_data):
        variants_data = validated_data.pop('variants', [])
        addons_data = validated_data.pop('addons', [])

        # Set restaurant from context
        validated_data['restaurant'] = self.context['restaurant']

        product = Product.objects.create(**validated_data)

        # Create variants
        for variant_data in variants_data:
            ProductVariant.objects.create(product=product, **variant_data)

        # Create addons
        for addon_data in addons_data:
            ProductAddon.objects.create(product=product, **addon_data)

        return product


class ProductUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating products."""

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'image', 'price', 'discount_price',
            'category', 'is_available', 'stock_quantity', 'track_stock',
            'preparation_time', 'calories', 'tags', 'sort_order',
            'is_featured', 'is_active'
        ]


class TaxSerializer(serializers.ModelSerializer):
    """Serializer for Tax model."""

    class Meta:
        model = Tax
        fields = [
            'id', 'name', 'rate', 'is_active', 'is_inclusive',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DiscountSerializer(serializers.ModelSerializer):
    """Serializer for Discount model."""

    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = Discount
        fields = [
            'id', 'code', 'name', 'description', 'discount_type', 'value',
            'min_order_amount', 'max_discount_amount', 'usage_limit',
            'usage_count', 'per_user_limit', 'start_date', 'end_date',
            'is_active', 'is_valid', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'usage_count', 'created_at', 'updated_at']


class DiscountValidateSerializer(serializers.Serializer):
    """Serializer for validating discount code."""

    code = serializers.CharField(required=True)
    order_amount = serializers.DecimalField(
        max_digits=12, decimal_places=2, required=True
    )


class MenuPublicSerializer(serializers.Serializer):
    """Serializer for public menu view."""

    categories = CategorySerializer(many=True)
    products = ProductDetailSerializer(many=True)
