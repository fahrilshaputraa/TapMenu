from django.contrib import admin

from .models import Restaurant, RestaurantAppearance


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
	list_display = ['name', 'owner', 'slug', 'is_open', 'cash_enabled', 'qris_enabled', 'updated_at']
	list_filter = ['is_open', 'cash_enabled', 'qris_enabled']
	search_fields = ['name', 'slug', 'owner__email', 'phone_number', 'address']
	readonly_fields = ['created_at', 'updated_at']


@admin.register(RestaurantAppearance)
class RestaurantAppearanceAdmin(admin.ModelAdmin):
	list_display = ['restaurant', 'primary_color', 'accent_color']
	search_fields = ['restaurant__name', 'hero_title', 'hero_subtitle']
