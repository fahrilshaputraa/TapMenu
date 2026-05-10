from django.contrib import admin

from .models import Category, MenuItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	list_display = ['name', 'restaurant', 'sort_order', 'is_active', 'updated_at']
	list_filter = ['is_active', 'restaurant']
	search_fields = ['name', 'description', 'restaurant__name']
	readonly_fields = ['created_at', 'updated_at']


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
	list_display = ['name', 'restaurant', 'category', 'price', 'stock_quantity', 'is_available', 'is_featured']
	list_filter = ['is_available', 'is_featured', 'restaurant', 'category']
	search_fields = ['name', 'sku', 'description', 'restaurant__name', 'category__name']
	readonly_fields = ['created_at', 'updated_at']
