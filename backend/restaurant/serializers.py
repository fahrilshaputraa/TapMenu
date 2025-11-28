from rest_framework import serializers
from .models import Restaurant, Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon']

class ProductSerializer(serializers.ModelSerializer):
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'image', 'image_url', 'is_popular', 'category', 'category_slug']

class RestaurantSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'slug', 'description', 'address', 'open_time', 'close_time', 'logo', 'logo_url', 'banner', 'banner_url', 'categories', 'products']
