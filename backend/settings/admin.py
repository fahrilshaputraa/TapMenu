from django.contrib import admin

from .models import Table, Voucher


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
	list_display = ['name', 'restaurant', 'code', 'area', 'seats', 'public_token', 'is_active']
	list_filter = ['is_active', 'area', 'restaurant']
	search_fields = ['name', 'code', 'restaurant__name']
	readonly_fields = ['public_token', 'created_at', 'updated_at']


@admin.register(Voucher)
class VoucherAdmin(admin.ModelAdmin):
	list_display = ['code', 'name', 'restaurant', 'discount_type', 'amount', 'minimum_spend', 'is_active']
	list_filter = ['discount_type', 'is_active', 'restaurant']
	search_fields = ['code', 'name', 'restaurant__name']
	readonly_fields = ['created_at', 'updated_at']
