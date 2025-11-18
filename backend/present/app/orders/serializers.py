from rest_framework import serializers
from .models import Order, OrderItem, OrderItemAddon, OrderStatusHistory


class OrderItemAddonSerializer(serializers.ModelSerializer):
    """Serializer for OrderItemAddon model."""

    class Meta:
        model = OrderItemAddon
        fields = ['id', 'addon', 'addon_name', 'price', 'quantity']
        read_only_fields = ['id']


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model."""

    addons = OrderItemAddonSerializer(many=True, read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'variant', 'product_name', 'variant_name',
            'unit_price', 'quantity', 'subtotal', 'notes', 'status',
            'addons', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'subtotal', 'created_at', 'updated_at']


class OrderItemCreateSerializer(serializers.Serializer):
    """Serializer for creating order items."""

    product_id = serializers.IntegerField(required=True)
    variant_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(required=True, min_value=1)
    notes = serializers.CharField(required=False, allow_blank=True)
    addons = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        default=list
    )


class OrderListSerializer(serializers.ModelSerializer):
    """Serializer for listing orders."""

    table_number = serializers.CharField(source='table.table_number', read_only=True)
    items_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'uuid', 'table', 'table_number',
            'customer_name', 'order_type', 'status', 'payment_status',
            'total', 'items_count', 'created_at'
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    """Serializer for order details."""

    table_number = serializers.CharField(source='table.table_number', read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'uuid', 'restaurant', 'table', 'table_number',
            'customer', 'customer_name', 'customer_phone', 'customer_email',
            'order_type', 'status', 'notes', 'subtotal', 'tax_amount',
            'service_charge', 'discount_amount', 'total', 'discount',
            'payment_status', 'payment_method', 'items',
            'created_at', 'updated_at', 'confirmed_at', 'completed_at'
        ]
        read_only_fields = ['id', 'order_number', 'uuid', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.Serializer):
    """Serializer for creating orders."""

    table_id = serializers.IntegerField(required=False, allow_null=True)
    session_code = serializers.UUIDField(required=False, allow_null=True)
    order_type = serializers.ChoiceField(
        choices=['dine_in', 'takeaway'],
        default='dine_in'
    )
    customer_name = serializers.CharField(required=False, allow_blank=True)
    customer_phone = serializers.CharField(required=False, allow_blank=True)
    customer_email = serializers.EmailField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    items = OrderItemCreateSerializer(many=True, required=True)
    discount_code = serializers.CharField(required=False, allow_blank=True)


class OrderUpdateStatusSerializer(serializers.Serializer):
    """Serializer for updating order status."""

    status = serializers.ChoiceField(
        choices=[
            'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'
        ],
        required=True
    )
    notes = serializers.CharField(required=False, allow_blank=True)


class OrderItemUpdateStatusSerializer(serializers.Serializer):
    """Serializer for updating order item status."""

    status = serializers.ChoiceField(
        choices=['preparing', 'ready', 'served', 'cancelled'],
        required=True
    )


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    """Serializer for OrderStatusHistory model."""

    changed_by_name = serializers.CharField(
        source='changed_by.full_name', read_only=True
    )

    class Meta:
        model = OrderStatusHistory
        fields = [
            'id', 'status', 'changed_by', 'changed_by_name',
            'notes', 'created_at'
        ]


class KitchenOrderSerializer(serializers.ModelSerializer):
    """Serializer for kitchen display orders."""

    table_number = serializers.CharField(source='table.table_number', read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'table_number', 'order_type',
            'status', 'notes', 'items', 'created_at', 'confirmed_at'
        ]


class CashierOrderSerializer(serializers.ModelSerializer):
    """Serializer for cashier view orders."""

    table_number = serializers.CharField(source='table.table_number', read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'table_number', 'customer_name',
            'order_type', 'status', 'subtotal', 'tax_amount',
            'service_charge', 'discount_amount', 'total',
            'payment_status', 'payment_method', 'items', 'created_at'
        ]
