from rest_framework import serializers

from .models import Table, Voucher


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ('id', 'name', 'code', 'area', 'seats', 'public_token', 'is_active')
        read_only_fields = ('id', 'public_token')


class VoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voucher
        fields = (
            'id',
            'code',
            'name',
            'discount_type',
            'amount',
            'minimum_spend',
            'max_discount',
            'is_active',
            'valid_from',
            'valid_until',
        )
        read_only_fields = ('id',)