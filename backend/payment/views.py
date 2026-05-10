from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from orders.models import Order
from .services import MidtransService
from .models import PaymentMethod, PaymentStatus, PaymentTransaction
from .serializers import PaymentTransactionSerializer

class CheckoutView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        method = request.data.get('method', PaymentMethod.QRIS)

        try:
            existing_tx = PaymentTransaction.objects.get(order=order)
            if existing_tx.status == PaymentStatus.SETTLEMENT:
                return Response({'error': 'Order already paid'}, status=status.HTTP_400_BAD_REQUEST)
        except PaymentTransaction.DoesNotExist:
            pass

        service = MidtransService()
        try:
            payment_tx = service.create_transaction(order, method)
            return Response(PaymentTransactionSerializer(payment_tx).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConfirmPaymentView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, order_id):
        payment_tx = get_object_or_404(PaymentTransaction, order_id=order_id)
        if payment_tx.status == PaymentStatus.SETTLEMENT:
            return Response(PaymentTransactionSerializer(payment_tx).data)

        service = MidtransService()
        payment_tx = service.mark_paid(payment_tx)
        return Response(PaymentTransactionSerializer(payment_tx).data)


class WebhookView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        service = MidtransService()
        success = service.handle_notification(request.data)

        if success:
            return Response({'status': 'ok'})
        return Response({'error': 'Failed to process webhook'}, status=status.HTTP_400_BAD_REQUEST)
