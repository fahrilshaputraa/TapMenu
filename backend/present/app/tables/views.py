from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiResponse, inline_serializer

from .models import Table, QRCode, TableSession
from .serializers import (
    TableListSerializer, TableDetailSerializer, TableCreateSerializer,
    TableUpdateSerializer, QRCodeSerializer, TableSessionSerializer,
    TableSessionCreateSerializer, QRCodeCustomizeSerializer
)
from app.account.permissions import IsStaff, IsAdmin


class TableViewSet(viewsets.ModelViewSet):
    """ViewSet for table management."""

    permission_classes = [IsAuthenticated, IsStaff]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        return Table.objects.filter(restaurant_id=restaurant_id)

    def get_serializer_class(self):
        if self.action == 'list':
            return TableListSerializer
        elif self.action == 'create':
            return TableCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TableUpdateSerializer
        return TableDetailSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['restaurant'] = self.kwargs.get('restaurant_id')
        return context

    @extend_schema(
        request=QRCodeCustomizeSerializer,
        responses={200: QRCodeSerializer},
        description='Get or customize QR code for table'
    )
    @action(detail=True, methods=['get', 'patch'])
    def qr_code(self, request, restaurant_id=None, pk=None):
        """Get or customize QR code for table."""
        table = self.get_object()

        try:
            qr_code = table.qr_code
        except QRCode.DoesNotExist:
            qr_code = QRCode.objects.create(table=table)

        if request.method == 'GET':
            return Response(QRCodeSerializer(qr_code).data)

        # PATCH - customize QR code
        serializer = QRCodeCustomizeSerializer(
            qr_code, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # TODO: Regenerate QR image with new colors

        return Response(QRCodeSerializer(qr_code).data)

    @extend_schema(
        responses={200: QRCodeSerializer},
        description='Regenerate QR code with new UUID'
    )
    @action(detail=True, methods=['post'])
    def regenerate_qr(self, request, restaurant_id=None, pk=None):
        """Regenerate QR code with new UUID."""
        table = self.get_object()

        try:
            qr_code = table.qr_code
            qr_code.delete()
        except QRCode.DoesNotExist:
            pass

        qr_code = QRCode.objects.create(table=table)

        return Response(QRCodeSerializer(qr_code).data)

    @extend_schema(
        request=inline_serializer(
            name='BulkCreateTablesRequest',
            fields={
                'count': serializers.IntegerField(default=1),
                'start_number': serializers.IntegerField(default=1),
                'capacity': serializers.IntegerField(default=4),
                'floor': serializers.CharField(required=False, default=''),
                'section': serializers.CharField(required=False, default=''),
            }
        ),
        responses={201: TableListSerializer(many=True)},
        description='Bulk create multiple tables'
    )
    @action(detail=False, methods=['post'], permission_classes=[IsAdmin])
    def bulk_create(self, request, restaurant_id=None):
        """Bulk create tables."""
        count = request.data.get('count', 1)
        start_number = request.data.get('start_number', 1)
        capacity = request.data.get('capacity', 4)
        floor = request.data.get('floor', '')
        section = request.data.get('section', '')

        tables = []
        for i in range(count):
            table = Table.objects.create(
                restaurant_id=restaurant_id,
                table_number=str(start_number + i),
                capacity=capacity,
                floor=floor,
                section=section
            )
            QRCode.objects.create(table=table)
            tables.append(table)

        return Response(
            TableListSerializer(tables, many=True).data,
            status=status.HTTP_201_CREATED
        )


class TableSessionViewSet(viewsets.ModelViewSet):
    """ViewSet for table sessions."""

    serializer_class = TableSessionSerializer
    permission_classes = [IsAuthenticated, IsStaff]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        return TableSession.objects.filter(
            table__restaurant_id=restaurant_id
        )

    @extend_schema(
        responses={200: TableSessionSerializer},
        description='End a table session'
    )
    @action(detail=True, methods=['post'])
    def end(self, request, restaurant_id=None, pk=None):
        """End a table session."""
        session = self.get_object()
        session.status = 'completed'
        session.ended_at = timezone.now()
        session.save()

        # Update table status
        session.table.status = 'available'
        session.table.save()

        return Response(TableSessionSerializer(session).data)


class PublicTableViewSet(viewsets.ViewSet):
    """Public ViewSet for customer table scanning."""

    permission_classes = [AllowAny]

    @extend_schema(
        request=TableSessionCreateSerializer,
        responses={200: OpenApiResponse(description='Session started successfully')},
        description='Scan QR code and start table session'
    )
    @action(detail=False, methods=['post'])
    def scan(self, request):
        """Scan QR code and start session."""
        serializer = TableSessionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        qr_code_uuid = serializer.validated_data['qr_code']

        try:
            qr_code = QRCode.objects.get(code=qr_code_uuid, is_active=True)
        except QRCode.DoesNotExist:
            return Response(
                {'error': 'Invalid or inactive QR code'},
                status=status.HTTP_400_BAD_REQUEST
            )

        table = qr_code.table

        # Update QR code scan stats
        qr_code.scan_count += 1
        qr_code.last_scanned_at = timezone.now()
        qr_code.save()

        # Create or get active session
        session, created = TableSession.objects.get_or_create(
            table=table,
            status='active',
            defaults={
                'customer': request.user if request.user.is_authenticated else None,
                'guest_name': serializer.validated_data.get('guest_name', ''),
                'guest_phone': serializer.validated_data.get('guest_phone', '')
            }
        )

        # Update table status
        if table.status == 'available':
            table.status = 'occupied'
            table.save()

        # Get restaurant info
        from app.restaurants.serializers import RestaurantPublicSerializer
        restaurant_data = RestaurantPublicSerializer(table.restaurant).data

        return Response({
            'session': TableSessionSerializer(session).data,
            'restaurant': restaurant_data,
            'table': TableDetailSerializer(table).data
        })
