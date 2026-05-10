from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from restaurants.utils import STAFF_ACCESS_ROLES, ensure_roles, require_user_restaurant

from .models import Order
from .serializers import OrderSerializer, CreateOrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        ensure_roles(self.request.user, STAFF_ACCESS_ROLES)
        restaurant = require_user_restaurant(self.request.user)
        queryset = Order.objects.filter(restaurant=restaurant).select_related('table', 'voucher').prefetch_related('items')
        status_value = self.request.query_params.get('status')
        if status_value:
            queryset = queryset.filter(status=status_value)
            
        date_value = self.request.query_params.get('date')
        if date_value == 'today':
            from django.utils import timezone
            queryset = queryset.filter(created_at__date=timezone.now().date())
        elif date_value:
            queryset = queryset.filter(created_at__date=date_value)

        return queryset.order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        for field in ['status', 'payment_method', 'notes']:
            if field in request.data:
                setattr(order, field, request.data[field])
        order.save()
        return Response(OrderSerializer(order).data)


class PublicCreateOrderView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class PublicOrderStatusView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, order_code):
        order = Order.objects.filter(order_code=order_code).select_related('table', 'voucher').prefetch_related('items').first()
        if order is None:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(OrderSerializer(order).data)
