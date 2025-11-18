from rest_framework import serializers
from .models import PaymentTransaction, PaymentMethod, Refund


class PaymentMethodSerializer(serializers.ModelSerializer):
    """Serializer for PaymentMethod model."""

    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'method_type', 'name', 'description', 'gateway',
            'is_active', 'min_amount', 'max_amount', 'fee_percentage',
            'fee_fixed', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PaymentMethodConfigSerializer(serializers.ModelSerializer):
    """Serializer for payment method with gateway config (admin only)."""

    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'method_type', 'name', 'description', 'gateway',
            'gateway_config', 'is_active', 'min_amount', 'max_amount',
            'fee_percentage', 'fee_fixed', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PaymentTransactionSerializer(serializers.ModelSerializer):
    """Serializer for PaymentTransaction model."""

    order_number = serializers.CharField(source='order.order_number', read_only=True)

    class Meta:
        model = PaymentTransaction
        fields = [
            'id', 'transaction_id', 'uuid', 'order', 'order_number',
            'amount', 'payment_method', 'gateway', 'status',
            'paid_at', 'expired_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'transaction_id', 'uuid', 'created_at', 'updated_at'
        ]


class PaymentCreateSerializer(serializers.Serializer):
    """Serializer for creating payment."""

    order_id = serializers.IntegerField(required=True)
    payment_method = serializers.CharField(required=True)
    gateway = serializers.ChoiceField(
        choices=['manual', 'midtrans', 'xendit', 'doku'],
        default='manual'
    )


class PaymentCashSerializer(serializers.Serializer):
    """Serializer for cash payment processing."""

    amount_received = serializers.DecimalField(
        max_digits=12, decimal_places=2, required=True
    )


class PaymentCallbackSerializer(serializers.Serializer):
    """Serializer for payment gateway callback."""

    transaction_id = serializers.CharField(required=True)
    gateway_transaction_id = serializers.CharField(required=True)
    status = serializers.CharField(required=True)
    gateway_response = serializers.DictField(required=False)


class RefundSerializer(serializers.ModelSerializer):
    """Serializer for Refund model."""

    transaction_id = serializers.CharField(
        source='transaction.transaction_id', read_only=True
    )

    class Meta:
        model = Refund
        fields = [
            'id', 'refund_id', 'transaction', 'transaction_id',
            'amount', 'reason', 'status', 'gateway_refund_id',
            'created_at', 'completed_at'
        ]
        read_only_fields = [
            'id', 'refund_id', 'gateway_refund_id', 'created_at', 'completed_at'
        ]


class RefundCreateSerializer(serializers.Serializer):
    """Serializer for creating refund."""

    transaction_id = serializers.CharField(required=True)
    amount = serializers.DecimalField(
        max_digits=12, decimal_places=2, required=True
    )
    reason = serializers.CharField(required=True)


class PaymentSummarySerializer(serializers.Serializer):
    """Serializer for payment summary."""

    total_transactions = serializers.IntegerField()
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    successful_transactions = serializers.IntegerField()
    failed_transactions = serializers.IntegerField()
    pending_transactions = serializers.IntegerField()
