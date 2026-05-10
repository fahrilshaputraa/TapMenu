from django.contrib import admin

from .models import PaymentTransaction


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
	list_display = ['reference_id', 'order', 'method', 'provider', 'status', 'gross_amount', 'paid_at']
	list_filter = ['method', 'provider', 'status']
	search_fields = ['reference_id', 'transaction_id', 'order__order_code']
	readonly_fields = ['created_at', 'updated_at', 'paid_at']
