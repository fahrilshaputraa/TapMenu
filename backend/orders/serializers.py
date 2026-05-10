from decimal import Decimal

from rest_framework import serializers

from .models import Order, OrderItem
from catalogs.models import MenuItem
from restaurants.utils import require_user_restaurant
from settings.models import Table, Voucher

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.ReadOnlyField(source='menu_item.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_name', 'item_name', 'quantity', 'unit_price', 'notes', 'subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    table_name = serializers.ReadOnlyField(source='table.name')
    voucher_code = serializers.ReadOnlyField(source='voucher.code')

    class Meta:
        model = Order
        fields = [
            'id',
            'order_code',
            'customer',
            'customer_name',
            'customer_phone',
            'table',
            'table_name',
            'table_number',
            'voucher',
            'voucher_code',
            'order_type',
            'channel',
            'status',
            'subtotal_amount',
            'discount_amount',
            'tax_amount',
            'service_amount',
            'total_amount',
            'payment_method',
            'paid_at',
            'notes',
            'created_at',
            'updated_at',
            'items',
        ]


class CreateOrderItemSerializer(serializers.Serializer):
    menu_item_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    notes = serializers.CharField(required=False, allow_blank=True)


class CreateOrderSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    customer_phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    table_number = serializers.CharField(max_length=50, required=False, allow_blank=True)
    table_id = serializers.IntegerField(required=False)
    table_token = serializers.CharField(required=False)
    voucher_code = serializers.CharField(max_length=50, required=False, allow_blank=True)
    order_type = serializers.ChoiceField(choices=Order._meta.get_field('order_type').choices, default='dine_in')
    channel = serializers.ChoiceField(choices=Order._meta.get_field('channel').choices, default='customer')
    payment_method = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    items = CreateOrderItemSerializer(many=True)

    def _resolve_restaurant_and_table(self):
        request = self.context['request']
        if request.user.is_authenticated and request.user.role != 5:
            restaurant = require_user_restaurant(request.user)
            table_id = self.validated_data.get('table_id')
            table = None
            if table_id:
                table = Table.objects.filter(id=table_id, restaurant=restaurant).first()
            return restaurant, table

        table_token = self.validated_data.get('table_token')
        if not table_token:
            raise serializers.ValidationError({'table_token': 'Table token is required for customer orders.'})

        try:
            table = Table.objects.select_related('restaurant').get(public_token=table_token, is_active=True)
        except Table.DoesNotExist as error:
            raise serializers.ValidationError({'table_token': 'Table not found.'}) from error

        return table.restaurant, table

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        request = self.context['request']
        restaurant, table = self._resolve_restaurant_and_table()
        user = request.user if request.user.is_authenticated else None
        voucher = None
        voucher_code = validated_data.pop('voucher_code', '').strip().upper()

        subtotal_amount = Decimal('0.00')
        order_items = []
        menu_items = {
            item.id: item
            for item in MenuItem.objects.filter(
                restaurant=restaurant,
                id__in=[row['menu_item_id'] for row in items_data],
            )
        }

        for item_data in items_data:
            menu_item = menu_items.get(item_data['menu_item_id'])
            if menu_item is None or not menu_item.in_stock:
                raise serializers.ValidationError({'items': f"Menu item {item_data['menu_item_id']} is not available."})

            qty = item_data['quantity']
            unit_price = menu_item.effective_price
            subtotal_amount += unit_price * qty
            order_items.append(
                OrderItem(
                    menu_item=menu_item,
                    item_name=menu_item.name,
                    quantity=qty,
                    unit_price=unit_price,
                    notes=item_data.get('notes', ''),
                )
            )

        discount_amount = Decimal('0.00')
        if voucher_code:
            voucher = Voucher.objects.filter(restaurant=restaurant, code=voucher_code).first()
            if voucher is None or not voucher.is_valid_for_amount(subtotal_amount):
                raise serializers.ValidationError({'voucher_code': 'Voucher is not valid for this order.'})
            discount_amount = voucher.calculate_discount(subtotal_amount)

        taxable_base = subtotal_amount - discount_amount
        tax_amount = taxable_base * (restaurant.tax_rate / Decimal('100'))
        service_amount = taxable_base * (restaurant.service_charge_rate / Decimal('100'))
        total_amount = taxable_base + tax_amount + service_amount

        order_count = Order.objects.filter(restaurant=restaurant).count() + 1
        order = Order.objects.create(
            restaurant=restaurant,
            customer=user,
            cashier=user if user and user.role == 3 else None,
            table=table,
            voucher=voucher,
            order_code=f'ORD-{restaurant.id:02d}-{order_count:05d}',
            customer_name=validated_data.get('customer_name', ''),
            customer_phone=validated_data.get('customer_phone', ''),
            table_number=validated_data.get('table_number', ''),
            order_type=validated_data.get('order_type', 'dine_in'),
            channel=validated_data.get('channel', 'customer'),
            subtotal_amount=subtotal_amount,
            discount_amount=discount_amount,
            tax_amount=tax_amount,
            service_amount=service_amount,
            total_amount=total_amount,
            payment_method=validated_data.get('payment_method', ''),
            notes=validated_data.get('notes', ''),
        )

        for order_item in order_items:
            order_item.order = order
        OrderItem.objects.bulk_create(order_items)

        return order
