from rest_framework import status
from rest_framework.test import APITestCase

from restaurants.models import Restaurant
from users.models import User, UserRole

from .models import Voucher


class SettingsApiTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            email='owner@example.com',
            password='password123',
            role=UserRole.OWNER,
            is_staff=True,
        )
        self.restaurant = Restaurant.objects.create(
            owner=self.owner,
            name='Warung Test',
            slug='warung-test',
        )
        self.cashier = User.objects.create_user(
            email='cashier@example.com',
            password='password123',
            role=UserRole.CASHIER,
            restaurant=self.restaurant,
        )
        self.voucher = Voucher.objects.create(
            restaurant=self.restaurant,
            code='PROMO10',
            name='Promo Sepuluh',
            discount_type='percentage',
            amount='10.00',
            minimum_spend='50000.00',
            is_active=True,
        )

    def test_cashier_can_list_vouchers(self):
        self.client.force_authenticate(self.cashier)
        response = self.client.get('/api/v1/settings/vouchers/', format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['code'], self.voucher.code)

    def test_cashier_cannot_create_voucher(self):
        self.client.force_authenticate(self.cashier)
        response = self.client.post(
            '/api/v1/settings/vouchers/',
            {
                'code': 'PROMO20',
                'name': 'Promo Dua Puluh',
                'discount_type': 'percentage',
                'amount': 20,
                'minimum_spend': 50000,
                'is_active': True,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
