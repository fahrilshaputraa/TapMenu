from rest_framework import serializers
from .models import LoyaltyProgram, CustomerLoyalty, PointTransaction, LoyaltyTier


class LoyaltyTierSerializer(serializers.ModelSerializer):
    """Serializer for LoyaltyTier model."""

    class Meta:
        model = LoyaltyTier
        fields = [
            'id', 'name', 'min_points', 'multiplier', 'benefits', 'color', 'icon'
        ]
        read_only_fields = ['id']


class LoyaltyProgramSerializer(serializers.ModelSerializer):
    """Serializer for LoyaltyProgram model."""

    tiers = LoyaltyTierSerializer(many=True, read_only=True)

    class Meta:
        model = LoyaltyProgram
        fields = [
            'id', 'name', 'is_active', 'points_per_currency',
            'currency_per_point', 'min_points_redeem', 'max_points_per_order',
            'points_expire_days', 'tiers', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CustomerLoyaltySerializer(serializers.ModelSerializer):
    """Serializer for CustomerLoyalty model."""

    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    tier_info = serializers.SerializerMethodField()

    class Meta:
        model = CustomerLoyalty
        fields = [
            'id', 'restaurant', 'restaurant_name', 'total_points',
            'available_points', 'redeemed_points', 'tier', 'tier_info',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_tier_info(self, obj):
        try:
            tier = LoyaltyTier.objects.filter(
                loyalty_program__restaurant=obj.restaurant,
                name=obj.tier
            ).first()
            if tier:
                return LoyaltyTierSerializer(tier).data
        except Exception:
            pass
        return None


class PointTransactionSerializer(serializers.ModelSerializer):
    """Serializer for PointTransaction model."""

    order_number = serializers.CharField(
        source='order.order_number', read_only=True
    )

    class Meta:
        model = PointTransaction
        fields = [
            'id', 'transaction_type', 'points', 'balance_after',
            'description', 'order', 'order_number', 'expires_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class PointRedeemSerializer(serializers.Serializer):
    """Serializer for redeeming points."""

    points = serializers.IntegerField(required=True, min_value=1)
    order_id = serializers.IntegerField(required=True)


class PointEarnSerializer(serializers.Serializer):
    """Serializer for earning points."""

    order_id = serializers.IntegerField(required=True)
    amount = serializers.DecimalField(
        max_digits=12, decimal_places=2, required=True
    )


class LoyaltyBalanceSerializer(serializers.Serializer):
    """Serializer for loyalty balance summary."""

    available_points = serializers.IntegerField()
    total_earned = serializers.IntegerField()
    total_redeemed = serializers.IntegerField()
    points_value = serializers.DecimalField(max_digits=12, decimal_places=2)
    tier = serializers.CharField()
    next_tier = serializers.CharField(allow_null=True)
    points_to_next_tier = serializers.IntegerField(allow_null=True)


class LoyaltyProgramCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating loyalty program."""

    class Meta:
        model = LoyaltyProgram
        fields = [
            'name', 'is_active', 'points_per_currency', 'currency_per_point',
            'min_points_redeem', 'max_points_per_order', 'points_expire_days'
        ]

    def create(self, validated_data):
        validated_data['restaurant'] = self.context['restaurant']
        program = super().create(validated_data)

        # Create default tiers
        default_tiers = [
            {'name': 'Bronze', 'min_points': 0, 'multiplier': 1.0, 'color': '#CD7F32'},
            {'name': 'Silver', 'min_points': 1000, 'multiplier': 1.2, 'color': '#C0C0C0'},
            {'name': 'Gold', 'min_points': 5000, 'multiplier': 1.5, 'color': '#FFD700'},
            {'name': 'Platinum', 'min_points': 10000, 'multiplier': 2.0, 'color': '#E5E4E2'},
        ]

        for tier_data in default_tiers:
            LoyaltyTier.objects.create(loyalty_program=program, **tier_data)

        return program
