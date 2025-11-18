from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.db.models import Count
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiParameter

from .models import Order, OrderItem, OrderItemAddon, OrderStatusHistory
from .serializers import (
    OrderListSerializer, OrderDetailSerializer, OrderCreateSerializer,
    OrderUpdateStatusSerializer, OrderItemSerializer,
    OrderItemUpdateStatusSerializer, OrderStatusHistorySerializer,
    KitchenOrderSerializer, CashierOrderSerializer
)
from app.account.permissions import IsStaff, IsKasir, IsKitchen
from app.menu.models import Product, Discount
from app.tables.models import Table, TableSession


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for order management."""

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        queryset = Order.objects.filter(
            restaurant_id=restaurant_id
        ).annotate(items_count=Count('items'))

        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Filter by payment status
        payment_status = self.request.query_params.get('payment_status')
        if payment_status:
            queryset = queryset.filter(payment_status=payment_status)

        # Filter by date
        date_filter = self.request.query_params.get('date')
        if date_filter:
            queryset = queryset.filter(created_at__date=date_filter)

        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        return OrderDetailSerializer

    @extend_schema(
        request=OrderUpdateStatusSerializer,
        responses={200: OrderDetailSerializer},
        description='Update order status'
    )
    @action(detail=True, methods=['post'])
    def update_status(self, request, restaurant_id=None, pk=None):
        """Update order status."""
        order = self.get_object()
        serializer = OrderUpdateStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_status = order.status
        new_status = serializer.validated_data['status']

        order.status = new_status
        if new_status == 'confirmed':
            order.confirmed_at = timezone.now()
        elif new_status == 'completed':
            order.completed_at = timezone.now()
        order.save()

        # Create status history
        OrderStatusHistory.objects.create(
            order=order,
            status=new_status,
            changed_by=request.user,
            notes=serializer.validated_data.get('notes', '')
        )

        return Response(OrderDetailSerializer(order).data)

    @extend_schema(
        responses={200: OrderStatusHistorySerializer(many=True)},
        description='Get order status history'
    )
    @action(detail=True, methods=['get'])
    def history(self, request, restaurant_id=None, pk=None):
        """Get order status history."""
        order = self.get_object()
        history = order.status_history.all()
        return Response(OrderStatusHistorySerializer(history, many=True).data)

    @extend_schema(
        request=OrderItemUpdateStatusSerializer,
        responses={200: OrderItemSerializer},
        description='Update individual item status'
    )
    @action(detail=True, methods=['post'])
    def items_status(self, request, restaurant_id=None, pk=None):
        """Update individual item status."""
        order = self.get_object()
        item_id = request.data.get('item_id')
        serializer = OrderItemUpdateStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            item = order.items.get(id=item_id)
            item.status = serializer.validated_data['status']
            item.save()
            return Response(OrderItemSerializer(item).data)
        except OrderItem.DoesNotExist:
            return Response(
                {'error': 'Item not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class KitchenOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for kitchen display system."""

    serializer_class = KitchenOrderSerializer
    permission_classes = [IsAuthenticated, IsKitchen]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        return Order.objects.filter(
            restaurant_id=restaurant_id,
            status__in=['confirmed', 'preparing']
        ).order_by('created_at')

    @extend_schema(
        responses={200: KitchenOrderSerializer},
        description='Mark order as preparing'
    )
    @action(detail=True, methods=['post'])
    def start_preparing(self, request, restaurant_id=None, pk=None):
        """Mark order as preparing."""
        order = self.get_object()
        order.status = 'preparing'
        order.save()

        OrderStatusHistory.objects.create(
            order=order,
            status='preparing',
            changed_by=request.user
        )

        return Response(KitchenOrderSerializer(order).data)

    @extend_schema(
        responses={200: KitchenOrderSerializer},
        description='Mark order as ready'
    )
    @action(detail=True, methods=['post'])
    def mark_ready(self, request, restaurant_id=None, pk=None):
        """Mark order as ready."""
        order = self.get_object()
        order.status = 'ready'
        order.save()

        # Update all items to ready
        order.items.filter(status='preparing').update(status='ready')

        OrderStatusHistory.objects.create(
            order=order,
            status='ready',
            changed_by=request.user
        )

        return Response(KitchenOrderSerializer(order).data)


class CashierOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for cashier interface."""

    serializer_class = CashierOrderSerializer
    permission_classes = [IsAuthenticated, IsKasir]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        return Order.objects.filter(
            restaurant_id=restaurant_id
        ).order_by('-created_at')

    @extend_schema(
        responses={200: CashierOrderSerializer},
        description='Mark order as paid (cash payment)'
    )
    @action(detail=True, methods=['post'])
    def mark_paid(self, request, restaurant_id=None, pk=None):
        """Mark order as paid (cash payment)."""
        order = self.get_object()
        order.payment_status = 'paid'
        order.payment_method = 'cash'
        order.save()

        return Response(CashierOrderSerializer(order).data)


class PublicOrderViewSet(viewsets.ViewSet):
    """Public ViewSet for customer orders."""

    permission_classes = [AllowAny]

    @extend_schema(
        request=OrderCreateSerializer,
        responses={201: OrderDetailSerializer},
        description='Create a new order from customer'
    )
    def create(self, request):
        """Create a new order."""
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Get restaurant from table or session
        table = None
        session = None
        restaurant_id = None

        if data.get('table_id'):
            table = Table.objects.get(id=data['table_id'])
            restaurant_id = table.restaurant_id
        elif data.get('session_code'):
            session = TableSession.objects.get(session_code=data['session_code'])
            table = session.table
            restaurant_id = table.restaurant_id

        if not restaurant_id:
            return Response(
                {'error': 'Table or session required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create order
        order = Order.objects.create(
            restaurant_id=restaurant_id,
            table=table,
            table_session=session,
            customer=request.user if request.user.is_authenticated else None,
            customer_name=data.get('customer_name', ''),
            customer_phone=data.get('customer_phone', ''),
            customer_email=data.get('customer_email', ''),
            order_type=data.get('order_type', 'dine_in'),
            notes=data.get('notes', '')
        )

        # Create order items
        subtotal = 0
        for item_data in data['items']:
            product = Product.objects.get(id=item_data['product_id'])
            unit_price = product.current_price

            # Add variant price adjustment
            variant = None
            variant_name = ''
            if item_data.get('variant_id'):
                variant = product.variants.get(id=item_data['variant_id'])
                unit_price += variant.price_adjustment
                variant_name = variant.name

            item_subtotal = unit_price * item_data['quantity']

            order_item = OrderItem.objects.create(
                order=order,
                product=product,
                variant=variant,
                product_name=product.name,
                variant_name=variant_name,
                unit_price=unit_price,
                quantity=item_data['quantity'],
                subtotal=item_subtotal,
                notes=item_data.get('notes', '')
            )

            # Create addons
            for addon_data in item_data.get('addons', []):
                addon = product.addons.get(id=addon_data['addon_id'])
                addon_qty = addon_data.get('quantity', 1)
                OrderItemAddon.objects.create(
                    order_item=order_item,
                    addon=addon,
                    addon_name=addon.name,
                    price=addon.price,
                    quantity=addon_qty
                )
                item_subtotal += addon.price * addon_qty

            subtotal += item_subtotal

        # Apply discount
        discount_amount = 0
        if data.get('discount_code'):
            try:
                discount = Discount.objects.get(
                    restaurant_id=restaurant_id,
                    code__iexact=data['discount_code']
                )
                if discount.is_valid:
                    if discount.discount_type == 'percentage':
                        discount_amount = subtotal * (discount.value / 100)
                        if discount.max_discount_amount:
                            discount_amount = min(
                                discount_amount, discount.max_discount_amount
                            )
                    else:
                        discount_amount = discount.value

                    order.discount = discount
                    discount.usage_count += 1
                    discount.save()
            except Discount.DoesNotExist:
                pass

        # Calculate totals
        from app.restaurants.models import Restaurant
        restaurant = Restaurant.objects.get(id=restaurant_id)

        tax_amount = subtotal * (restaurant.tax_rate / 100)
        service_charge = subtotal * (restaurant.service_charge / 100)
        total = subtotal + tax_amount + service_charge - discount_amount

        order.subtotal = subtotal
        order.tax_amount = tax_amount
        order.service_charge = service_charge
        order.discount_amount = discount_amount
        order.total = total
        order.save()

        return Response(
            OrderDetailSerializer(order).data,
            status=status.HTTP_201_CREATED
        )

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='uuid',
                type=str,
                location=OpenApiParameter.QUERY,
                description='Order UUID to track',
                required=True
            )
        ],
        responses={200: OrderDetailSerializer},
        description='Track order by UUID'
    )
    @action(detail=False, methods=['get'])
    def track(self, request):
        """Track order by UUID."""
        order_uuid = request.query_params.get('uuid')
        if not order_uuid:
            return Response(
                {'error': 'Order UUID required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            order = Order.objects.get(uuid=order_uuid)
            return Response(OrderDetailSerializer(order).data)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
