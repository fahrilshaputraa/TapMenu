from rest_framework import serializers
from .models import Review, ProductReview, ReviewHelpful


class ProductReviewSerializer(serializers.ModelSerializer):
    """Serializer for ProductReview model."""

    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = ProductReview
        fields = [
            'id', 'product', 'product_name', 'rating', 'comment', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review model."""

    customer_name = serializers.CharField(source='customer.full_name', read_only=True)
    product_reviews = ProductReviewSerializer(many=True, read_only=True)
    helpful_count = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'restaurant', 'order', 'customer', 'customer_name',
            'overall_rating', 'food_rating', 'service_rating', 'ambiance_rating',
            'comment', 'images', 'is_approved', 'is_featured',
            'response', 'responded_at', 'product_reviews', 'helpful_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'restaurant', 'customer', 'is_approved',
            'response', 'responded_at', 'created_at', 'updated_at'
        ]

    def get_helpful_count(self, obj):
        return obj.helpful_votes.filter(is_helpful=True).count()


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating reviews."""

    product_reviews = ProductReviewSerializer(many=True, required=False)

    class Meta:
        model = Review
        fields = [
            'order', 'overall_rating', 'food_rating', 'service_rating',
            'ambiance_rating', 'comment', 'images', 'product_reviews'
        ]

    def create(self, validated_data):
        product_reviews_data = validated_data.pop('product_reviews', [])

        # Set restaurant from order
        order = validated_data['order']
        validated_data['restaurant'] = order.restaurant
        validated_data['customer'] = self.context['request'].user

        review = Review.objects.create(**validated_data)

        # Create product reviews
        for product_review_data in product_reviews_data:
            ProductReview.objects.create(review=review, **product_review_data)

        return review


class ReviewResponseSerializer(serializers.Serializer):
    """Serializer for restaurant response to review."""

    response = serializers.CharField(required=True)


class ReviewHelpfulSerializer(serializers.ModelSerializer):
    """Serializer for ReviewHelpful model."""

    class Meta:
        model = ReviewHelpful
        fields = ['id', 'review', 'is_helpful', 'created_at']
        read_only_fields = ['id', 'created_at']


class ReviewSummarySerializer(serializers.Serializer):
    """Serializer for review summary/statistics."""

    total_reviews = serializers.IntegerField()
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    average_food_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    average_service_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    average_ambiance_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    rating_distribution = serializers.DictField()


class ReviewListSerializer(serializers.ModelSerializer):
    """Serializer for listing reviews (minimal data)."""

    customer_name = serializers.CharField(source='customer.full_name', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'customer_name', 'overall_rating', 'comment',
            'is_featured', 'created_at'
        ]
