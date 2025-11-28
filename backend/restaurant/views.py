from rest_framework import viewsets
from .models import Restaurant, Category, Product
from .serializers import RestaurantSerializer, CategorySerializer, ProductSerializer

class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    lookup_field = 'slug'

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filterset_fields = ['restaurant__slug', 'category__slug', 'is_popular']
