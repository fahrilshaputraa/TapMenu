from datetime import timedelta

import midtransclient
from django.conf import settings
from django.utils import timezone

from orders.models import Order
from orders.models import OrderStatus

from .models import PaymentMethod, PaymentStatus, PaymentTransaction


class MidtransService:
    def __init__(self):
        self.is_configured = bool(settings.MIDTRANS_SERVER_KEY and settings.MIDTRANS_CLIENT_KEY)
        self.snap = None
        if self.is_configured:
            self.snap = midtransclient.Snap(
                is_production=settings.MIDTRANS_IS_PRODUCTION,
                server_key=settings.MIDTRANS_SERVER_KEY,
                client_key=settings.MIDTRANS_CLIENT_KEY,
            )

    def mark_paid(self, payment_tx: PaymentTransaction):
        payment_tx.status = PaymentStatus.SETTLEMENT
        payment_tx.paid_at = timezone.now()
        payment_tx.save(update_fields=['status', 'paid_at', 'updated_at'])

        order = payment_tx.order
        order.status = OrderStatus.PAID
        order.paid_at = payment_tx.paid_at
        order.payment_method = payment_tx.method
        order.save(update_fields=['status', 'paid_at', 'payment_method', 'updated_at'])
        return payment_tx

    def create_transaction(self, order: Order, method: str) -> PaymentTransaction:
        reference_id = f"ORDER-{order.id}-{int(order.created_at.timestamp())}"

        if hasattr(order, 'payment'):
            payment_tx = order.payment
            payment_tx.method = method
            payment_tx.gross_amount = order.total_amount
            payment_tx.status = PaymentStatus.PENDING
            payment_tx.save()
        else:
            payment_tx = PaymentTransaction.objects.create(
                order=order,
                reference_id=reference_id,
                gross_amount=order.total_amount,
                method=method,
            )

        if method == PaymentMethod.CASH:
            payment_tx.provider = 'manual-cashier'
            payment_tx.payment_type = 'cash'
            payment_tx.save(update_fields=['provider', 'payment_type', 'updated_at'])
            return self.mark_paid(payment_tx)

        item_details = []
        for item in order.items.all():
            item_details.append({
                "id": str(item.menu_item.id) if item.menu_item else "0",
                "price": int(item.unit_price),
                "quantity": item.quantity,
                "name": item.item_name,
            })

        gross_amount = int(order.total_amount)

        if not self.is_configured:
            payment_tx.provider = 'mock-qris'
            payment_tx.payment_type = 'qris'
            payment_tx.qr_string = order.restaurant.qris_static_payload or f'MOCK-QRIS-{reference_id}'
            payment_tx.metadata = {
                'expires_at': (timezone.now() + timedelta(minutes=15)).isoformat(),
                'display_name': order.restaurant.qris_label or 'QRIS TapMenu',
            }
            payment_tx.save(update_fields=['provider', 'payment_type', 'qr_string', 'metadata', 'updated_at'])
            return payment_tx

        param = {
            "transaction_details": {
                "order_id": reference_id,
                "gross_amount": gross_amount,
            },
            "item_details": item_details,
            "customer_details": {
                "first_name": order.customer_name or (order.customer.full_name if order.customer else "Guest"),
                "email": order.customer.email if order.customer else "guest@example.com",
            },
        }

        transaction = self.snap.create_transaction(param)
        payment_tx.provider = 'midtrans'
        payment_tx.payment_url = transaction.get('redirect_url')
        payment_tx.transaction_id = transaction.get('token')
        payment_tx.payment_type = 'qris'
        payment_tx.metadata = {'snap_token': transaction.get('token')}
        payment_tx.save(
            update_fields=['provider', 'payment_url', 'transaction_id', 'payment_type', 'metadata', 'updated_at']
        )
        return payment_tx

    def handle_notification(self, payload: dict):
        if not self.is_configured:
            return False

        try:
            status_response = self.snap.transactions.status(payload.get('order_id'))
        except Exception:
            return False

        reference_id = status_response.get('order_id')
        transaction_status = status_response.get('transaction_status')
        fraud_status = status_response.get('fraud_status')
        
        try:
            payment_tx = PaymentTransaction.objects.get(reference_id=reference_id)
        except PaymentTransaction.DoesNotExist:
            return False

        if transaction_status == 'capture':
            if fraud_status == 'challenge':
                payment_tx.status = PaymentStatus.PENDING
            elif fraud_status == 'accept':
                payment_tx.status = PaymentStatus.SETTLEMENT
        elif transaction_status == 'settlement':
            payment_tx.status = PaymentStatus.SETTLEMENT
        elif transaction_status == 'cancel' or transaction_status == 'deny' or transaction_status == 'expire':
            payment_tx.status = PaymentStatus.CANCEL
        elif transaction_status == 'pending':
            payment_tx.status = PaymentStatus.PENDING

        payment_tx.payment_type = status_response.get('payment_type', '')
        payment_tx.save()

        if payment_tx.status == PaymentStatus.SETTLEMENT:
            self.mark_paid(payment_tx)
        elif payment_tx.status == PaymentStatus.CANCEL:
            order = payment_tx.order
            order.status = OrderStatus.CANCELLED
            order.save(update_fields=['status', 'updated_at'])

        return True
