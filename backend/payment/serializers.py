from rest_framework import serializers

from .models import PaymentTransaction


class PaymentTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTransaction
        fields = (
            'id',
            'reference_id',
            'transaction_id',
            'method',
            'provider',
            'payment_type',
            'status',
            'gross_amount',
            'payment_url',
            'qr_string',
            'metadata',
            'paid_at',
            'created_at',
            'updated_at',
        )