from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from catalogs.models import Category, MenuItem
from restaurants.models import Restaurant
from settings.models import Table

User = get_user_model()


class PublicCreateOrderTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_user(
            email='owner@example.com',
            password='secret123',
            full_name='Owner User',
            role=1,
        )
        self.restaurant = Restaurant.objects.create(
            owner=self.owner,
            name='TapMenu Cafe',
            slug='tapmenu-cafe',
            tax_rate=Decimal('10.00'),
            service_charge_rate=Decimal('5.00'),
        )
        self.category = Category.objects.create(
            restaurant=self.restaurant,
            name='Coffee',
        )
        self.menu_item = MenuItem.objects.create(
            restaurant=self.restaurant,
            category=self.category,
            name='Latte',
            price=Decimal('20000.00'),
            is_available=True,
        )
        self.table = Table.objects.create(
            restaurant=self.restaurant,
            name='Table 1',
            code='T1',
            is_active=True,
        )

    def test_public_create_order_supports_uuid_restaurant_ids(self):
        response = self.client.post(
            reverse('orders:public-create'),
            {
                'table_token': str(self.table.public_token),
                'customer_name': 'Buyer One',
                'items': [
                    {
                        'menu_item_id': self.menu_item.id,
                        'quantity': 2,
                    }
                ],
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['customer_name'], 'Buyer One')
        self.assertEqual(response.data['subtotal_amount'], '40000.00')
        self.assertEqual(response.data['tax_amount'], '4000.00')
        self.assertEqual(response.data['service_amount'], '2000.00')
        self.assertEqual(response.data['total_amount'], '46000.00')
        self.assertRegex(response.data['order_code'], r'^ORD-[0-9A-F]{6}-00001$')
