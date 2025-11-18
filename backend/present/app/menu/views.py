from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .models import Category, Product, ProductVariant, ProductAddon, Tax, Discount
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ProductCreateSerializer, ProductUpdateSerializer, ProductVariantSerializer,
    ProductAddonSerializer, TaxSerializer, DiscountSerializer,
    DiscountValidateSerializer
)
from app.account.permissions import IsAdmin, IsStaff


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for menu categories."""

    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsStaff]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        return Category.objects.filter(
            restaurant_id=restaurant_id
        ).annotate(products_count=Count('products'))

    def perform_create(self, serializer):
        restaurant_id = self.kwargs.get('restaurant_id')
        serializer.save(restaurant_id=restaurant_id)


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for menu products."""

    permission_classes = [IsAuthenticated, IsStaff]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        queryset = Product.objects.filter(restaurant_id=restaurant_id)

        # Filter by category
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        # Filter by availability
        available = self.request.query_params.get('available')
        if available is not None:
            queryset = queryset.filter(is_available=available == 'true')

        # Filter by featured
        featured = self.request.query_params.get('featured')
        if featured is not None:
            queryset = queryset.filter(is_featured=featured == 'true')

        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        elif self.action == 'create':
            return ProductCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ProductUpdateSerializer
        return ProductDetailSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['restaurant'] = self.kwargs.get('restaurant_id')
        return context

    def perform_create(self, serializer):
        restaurant_id = self.kwargs.get('restaurant_id')
        serializer.save(restaurant_id=restaurant_id)

    @extend_schema(
        responses={200: OpenApiResponse(description='Product availability toggled')},
        description='Toggle product availability status'
    )
    @action(detail=True, methods=['post'])
    def toggle_availability(self, request, restaurant_id=None, pk=None):
        """Toggle product availability."""
        product = self.get_object()
        product.is_available = not product.is_available
        product.save()
        return Response({
            'is_available': product.is_available,
            'message': f"Product is now {'available' if product.is_available else 'unavailable'}"
        })

    @extend_schema(
        request=ProductVariantSerializer,
        responses={200: ProductVariantSerializer(many=True)},
        description='Get, add, or bulk update product variants'
    )
    @action(detail=True, methods=['get', 'post', 'put'])
    def variants(self, request, restaurant_id=None, pk=None):
        """Manage product variants."""
        product = self.get_object()

        if request.method == 'GET':
            variants = product.variants.all()
            return Response(ProductVariantSerializer(variants, many=True).data)

        elif request.method == 'POST':
            serializer = ProductVariantSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        elif request.method == 'PUT':
            # Bulk update variants
            product.variants.all().delete()
            variants = []
            for variant_data in request.data:
                variant = ProductVariant.objects.create(
                    product=product, **variant_data
                )
                variants.append(variant)
            return Response(ProductVariantSerializer(variants, many=True).data)

    @extend_schema(
        request=ProductAddonSerializer,
        responses={200: ProductAddonSerializer(many=True)},
        description='Get, add, or bulk update product addons'
    )
    @action(detail=True, methods=['get', 'post', 'put'])
    def addons(self, request, restaurant_id=None, pk=None):
        """Manage product addons."""
        product = self.get_object()

        if request.method == 'GET':
            addons = product.addons.all()
            return Response(ProductAddonSerializer(addons, many=True).data)

        elif request.method == 'POST':
            serializer = ProductAddonSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        elif request.method == 'PUT':
            # Bulk update addons
            product.addons.all().delete()
            addons = []
            for addon_data in request.data:
                addon = ProductAddon.objects.create(
                    product=product, **addon_data
                )
                addons.append(addon)
            return Response(ProductAddonSerializer(addons, many=True).data)


class TaxViewSet(viewsets.ModelViewSet):
    """ViewSet for tax configurations."""

    serializer_class = TaxSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        return Tax.objects.filter(restaurant_id=restaurant_id)

    def perform_create(self, serializer):
        restaurant_id = self.kwargs.get('restaurant_id')
        serializer.save(restaurant_id=restaurant_id)


class DiscountViewSet(viewsets.ModelViewSet):
    """ViewSet for discounts/promo codes."""

    serializer_class = DiscountSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        return Discount.objects.filter(restaurant_id=restaurant_id)

    def perform_create(self, serializer):
        restaurant_id = self.kwargs.get('restaurant_id')
        serializer.save(restaurant_id=restaurant_id)

    @extend_schema(
        request=DiscountValidateSerializer,
        responses={200: OpenApiResponse(description='Discount validation result')},
        description='Validate a discount code for an order'
    )
    @action(detail=False, methods=['post'])
    def validate(self, request, restaurant_id=None):
        """Validate a discount code."""
        serializer = DiscountValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data['code']
        order_amount = serializer.validated_data['order_amount']

        try:
            discount = Discount.objects.get(
                restaurant_id=restaurant_id,
                code__iexact=code
            )
        except Discount.DoesNotExist:
            return Response(
                {'error': 'Invalid discount code'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not discount.is_valid:
            return Response(
                {'error': 'Discount code is not valid or has expired'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if order_amount < discount.min_order_amount:
            return Response({
                'error': f'Minimum order amount is {discount.min_order_amount}'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Calculate discount amount
        if discount.discount_type == 'percentage':
            discount_amount = order_amount * (discount.value / 100)
            if discount.max_discount_amount:
                discount_amount = min(discount_amount, discount.max_discount_amount)
        else:
            discount_amount = discount.value

        return Response({
            'valid': True,
            'discount': DiscountSerializer(discount).data,
            'discount_amount': discount_amount
        })
