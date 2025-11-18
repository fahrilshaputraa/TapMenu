from rest_framework import serializers
from .models import Table, QRCode, TableSession


class QRCodeSerializer(serializers.ModelSerializer):
    """Serializer for QRCode model."""

    url = serializers.CharField(read_only=True)

    class Meta:
        model = QRCode
        fields = [
            'id', 'code', 'foreground_color', 'background_color',
            'logo', 'qr_image', 'url', 'scan_count', 'last_scanned_at',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'code', 'qr_image', 'url', 'scan_count',
            'last_scanned_at', 'created_at', 'updated_at'
        ]


class TableListSerializer(serializers.ModelSerializer):
    """Serializer for listing tables."""

    has_qr_code = serializers.SerializerMethodField()

    class Meta:
        model = Table
        fields = [
            'id', 'table_number', 'name', 'capacity', 'status',
            'floor', 'section', 'has_qr_code'
        ]

    def get_has_qr_code(self, obj):
        return hasattr(obj, 'qr_code')


class TableDetailSerializer(serializers.ModelSerializer):
    """Serializer for table details."""

    qr_code = QRCodeSerializer(read_only=True)

    class Meta:
        model = Table
        fields = [
            'id', 'table_number', 'name', 'capacity', 'status',
            'floor', 'section', 'qr_code', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TableCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating tables."""

    class Meta:
        model = Table
        fields = [
            'table_number', 'name', 'capacity', 'floor', 'section'
        ]

    def create(self, validated_data):
        validated_data['restaurant'] = self.context['restaurant']
        table = super().create(validated_data)

        # Automatically create QR code for table
        QRCode.objects.create(table=table)

        return table


class TableUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating tables."""

    class Meta:
        model = Table
        fields = [
            'table_number', 'name', 'capacity', 'status', 'floor', 'section'
        ]


class TableSessionSerializer(serializers.ModelSerializer):
    """Serializer for TableSession model."""

    table_number = serializers.CharField(source='table.table_number', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)

    class Meta:
        model = TableSession
        fields = [
            'id', 'table', 'table_number', 'session_code',
            'customer', 'customer_email', 'guest_name', 'guest_phone',
            'status', 'started_at', 'ended_at'
        ]
        read_only_fields = ['id', 'session_code', 'started_at']


class TableSessionCreateSerializer(serializers.Serializer):
    """Serializer for creating table session (scanning QR)."""

    qr_code = serializers.UUIDField(required=True)
    guest_name = serializers.CharField(required=False, allow_blank=True)
    guest_phone = serializers.CharField(required=False, allow_blank=True)


class QRCodeCustomizeSerializer(serializers.ModelSerializer):
    """Serializer for customizing QR code appearance."""

    class Meta:
        model = QRCode
        fields = ['foreground_color', 'background_color', 'logo']
