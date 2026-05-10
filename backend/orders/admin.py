from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
	model = OrderItem
	extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
	list_display = ['order_code', 'restaurant', 'customer_name', 'status', 'channel', 'order_type', 'total_amount', 'created_at']
	list_filter = ['status', 'channel', 'order_type', 'payment_method', 'restaurant']
	search_fields = ['order_code', 'customer_name', 'customer_phone', 'table_number', 'restaurant__name']
	readonly_fields = ['created_at', 'updated_at', 'paid_at']
	inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
	list_display = ['order', 'item_name', 'quantity', 'unit_price']
	search_fields = ['order__order_code', 'item_name']
