from django.db.models import Sum
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order, OrderStatus
from restaurants.utils import OWNER_ACCESS_ROLES, ensure_roles, require_user_restaurant


class ReportSummaryView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		ensure_roles(request.user, OWNER_ACCESS_ROLES)
		restaurant = require_user_restaurant(request.user)
		orders = Order.objects.filter(restaurant=restaurant)
		paid_orders = orders.filter(status__in=[OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.COMPLETED])

		return Response(
			{
				'total_orders': orders.count(),
				'paid_orders': paid_orders.count(),
				'pending_orders': orders.filter(status=OrderStatus.PENDING).count(),
				'gross_sales': paid_orders.aggregate(total=Sum('total_amount'))['total'] or 0,
				'discounts': orders.aggregate(total=Sum('discount_amount'))['total'] or 0,
				'taxes': orders.aggregate(total=Sum('tax_amount'))['total'] or 0,
				'services': orders.aggregate(total=Sum('service_amount'))['total'] or 0,
			}
		)
