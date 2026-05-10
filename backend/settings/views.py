from rest_framework import permissions, viewsets

from restaurants.utils import OWNER_ACCESS_ROLES, ensure_roles, require_user_restaurant

from .models import Table, Voucher
from .serializers import TableSerializer, VoucherSerializer


class RestaurantScopedViewSet(viewsets.ModelViewSet):
	permission_classes = [permissions.IsAuthenticated]

	def get_restaurant(self):
		ensure_roles(self.request.user, OWNER_ACCESS_ROLES)
		return require_user_restaurant(self.request.user)


class TableViewSet(RestaurantScopedViewSet):
	serializer_class = TableSerializer

	def get_queryset(self):
		return Table.objects.filter(restaurant=self.get_restaurant()).order_by('code')

	def perform_create(self, serializer):
		serializer.save(restaurant=self.get_restaurant())


class VoucherViewSet(RestaurantScopedViewSet):
	serializer_class = VoucherSerializer

	def get_queryset(self):
		return Voucher.objects.filter(restaurant=self.get_restaurant()).order_by('code')

	def perform_create(self, serializer):
		serializer.save(restaurant=self.get_restaurant())
