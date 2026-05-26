from django.db.models import Sum
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order, OrderStatus
from restaurants.utils import OWNER_ACCESS_ROLES, ensure_roles, get_default_appearance_payload, get_user_restaurant

from .models import RestaurantAppearance
from .serializers import RestaurantAppearanceSerializer, RestaurantSerializer

class RestaurantProfileView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		restaurant = get_user_restaurant(request.user)
		if restaurant is None:
			return Response({'detail': 'Restaurant has not been created yet.'}, status=status.HTTP_404_NOT_FOUND)
		return Response(RestaurantSerializer(restaurant).data)

	def post(self, request):
		ensure_roles(request.user, OWNER_ACCESS_ROLES)
		serializer = RestaurantSerializer(data=request.data, context={'request': request})
		serializer.is_valid(raise_exception=True)
		restaurant = serializer.save()
		return Response(RestaurantSerializer(restaurant).data, status=status.HTTP_201_CREATED)

	def put(self, request):
		ensure_roles(request.user, OWNER_ACCESS_ROLES)
		restaurant = get_user_restaurant(request.user)
		if restaurant is None:
			return self.post(request)

		serializer = RestaurantSerializer(restaurant, data=request.data, context={'request': request})
		serializer.is_valid(raise_exception=True)
		restaurant = serializer.save()
		return Response(RestaurantSerializer(restaurant).data)


class RestaurantAppearanceView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		restaurant = get_user_restaurant(request.user)
		if restaurant is None:
			return Response({'detail': 'Restaurant has not been created yet.'}, status=status.HTTP_404_NOT_FOUND)
		appearance, _ = RestaurantAppearance.objects.get_or_create(
			restaurant=restaurant,
			defaults=get_default_appearance_payload(restaurant),
		)
		return Response(RestaurantAppearanceSerializer(appearance).data)

	def put(self, request):
		ensure_roles(request.user, OWNER_ACCESS_ROLES)
		restaurant = get_user_restaurant(request.user)
		if restaurant is None:
			return Response({'detail': 'Restaurant has not been created yet.'}, status=status.HTTP_404_NOT_FOUND)

		appearance, _ = RestaurantAppearance.objects.get_or_create(
			restaurant=restaurant,
			defaults=get_default_appearance_payload(restaurant),
		)
		serializer = RestaurantAppearanceSerializer(appearance, data=request.data)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data)


class DashboardOverviewView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		restaurant = get_user_restaurant(request.user)
		if restaurant is None:
			return Response({'detail': 'Restaurant has not been created yet.'}, status=status.HTTP_404_NOT_FOUND)

		orders = Order.objects.filter(restaurant=restaurant)
		
		today_date = timezone.now().date()
		today_orders = orders.filter(created_at__date=today_date)
		paid_orders = today_orders.filter(status__in=[OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.COMPLETED])
		
		summary = {
			'restaurant_name': restaurant.name,
			'is_open': restaurant.is_open,
			'today_orders': today_orders.count(),
			'paid_orders': paid_orders.count(),
			'revenue': paid_orders.aggregate(total=Sum('total_amount'))['total'] or 0,
			'pending_orders': orders.filter(status=OrderStatus.PENDING).count(),
			'menu_count': restaurant.menu_items.count(),
			'table_count': restaurant.tables.count(),
			'voucher_count': restaurant.vouchers.count(),
			'employee_count': restaurant.team_members.count(),
			'latest_orders': orders.select_related('table').prefetch_related('items')[:5].values(
				'id', 'order_code', 'customer_name', 'status', 'total_amount', 'created_at', 'table__name'
			),
		}
		return Response(summary)
