from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from restaurants.models import RestaurantAppearance
from restaurants.utils import OWNER_ACCESS_ROLES, STAFF_ACCESS_ROLES, ensure_roles, get_default_appearance_payload, require_user_restaurant
from settings.models import Table, Voucher

from .models import Category, MenuItem
from .serializers import CategorySerializer, MenuItemSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def _allowed_roles(self):
        if self.action in {'list', 'retrieve'}:
            return STAFF_ACCESS_ROLES
        return OWNER_ACCESS_ROLES

    def get_queryset(self):
        ensure_roles(self.request.user, self._allowed_roles())
        restaurant = require_user_restaurant(self.request.user)
        return Category.objects.filter(restaurant=restaurant).order_by('sort_order', 'name')

    def perform_create(self, serializer):
        ensure_roles(self.request.user, OWNER_ACCESS_ROLES)
        serializer.save(restaurant=require_user_restaurant(self.request.user))


class MenuItemViewSet(viewsets.ModelViewSet):
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def _allowed_roles(self):
        if self.action in {'list', 'retrieve'}:
            return STAFF_ACCESS_ROLES
        return OWNER_ACCESS_ROLES

    def get_queryset(self):
        ensure_roles(self.request.user, self._allowed_roles())
        restaurant = require_user_restaurant(self.request.user)
        queryset = MenuItem.objects.filter(restaurant=restaurant).select_related('category')
        category_id = self.request.query_params.get('category')
        if category_id is not None:
            queryset = queryset.filter(category_id=category_id)
        return queryset

    def perform_create(self, serializer):
        ensure_roles(self.request.user, OWNER_ACCESS_ROLES)
        serializer.save(restaurant=require_user_restaurant(self.request.user))


class PublicMenuView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        table_token = request.query_params.get('table')
        restaurant_id = request.query_params.get('restaurant')

        table = None
        restaurant = None
        if table_token:
            table = Table.objects.select_related('restaurant').filter(public_token=table_token, is_active=True).first()
            if table is not None:
                restaurant = table.restaurant

        if restaurant is None and restaurant_id:
            from restaurants.models import Restaurant

            restaurant = Restaurant.objects.filter(id=restaurant_id).first()

        if restaurant is None:
            return Response({'detail': 'Restaurant or table not found.'}, status=404)

        appearance, _ = RestaurantAppearance.objects.get_or_create(
            restaurant=restaurant,
            defaults=get_default_appearance_payload(restaurant),
        )
        categories = Category.objects.filter(restaurant=restaurant, is_active=True).order_by('sort_order', 'name')
        items = MenuItem.objects.filter(restaurant=restaurant, is_available=True).select_related('category').order_by('name')
        vouchers = Voucher.objects.filter(restaurant=restaurant, is_active=True).order_by('code')[:10]

        return Response(
            {
                'restaurant': {
                    'id': str(restaurant.id),
                    'name': restaurant.name,
                    'slug': restaurant.slug,
                    'description': restaurant.description,
                    'address': restaurant.address,
                    'is_open': restaurant.is_open,
                    'opening_time': restaurant.opening_time.strftime('%H:%M') if restaurant.opening_time else '08:00',
                    'closing_time': restaurant.closing_time.strftime('%H:%M') if restaurant.closing_time else '22:00',
                    'operational_days': restaurant.operational_days or {},
                    'cash_enabled': restaurant.cash_enabled,
                    'qris_enabled': restaurant.qris_enabled,
                    'qris_label': restaurant.qris_label,
                    'appearance': {
                        'hero_title': appearance.hero_title,
                        'hero_subtitle': appearance.hero_subtitle,
                        'primary_color': appearance.primary_color,
                        'accent_color': appearance.accent_color,
                        'font_style': appearance.font_style,
                        'bg_pattern': appearance.bg_pattern,
                        'bg_color': appearance.bg_color,
                        'layout_style': appearance.layout_style,
                        'header_style': appearance.header_style,
                        'show_banner': appearance.show_banner,
                        'show_profile': appearance.show_profile,
                        'show_images': appearance.show_images,
                        'show_description': appearance.show_description,
                        'card_radius': appearance.card_radius,
                        'card_shadow': appearance.card_shadow,
                        'button_style': appearance.button_style,
                        'logo_url': appearance.logo_url,
                        'cover_image_url': appearance.cover_image_url,
                    },
                },
                'table': None if table is None else {
                    'id': table.id,
                    'name': table.name,
                    'code': table.code,
                    'area': table.area,
                    'public_token': str(table.public_token),
                },
                'categories': CategorySerializer(categories, many=True).data,
                'items': MenuItemSerializer(items, many=True).data,
                'vouchers': [
                    {
                        'code': voucher.code,
                        'name': voucher.name,
                        'discount_type': voucher.discount_type,
                        'amount': voucher.amount,
                        'minimum_spend': voucher.minimum_spend,
                    }
                    for voucher in vouchers
                ],
            }
        )
