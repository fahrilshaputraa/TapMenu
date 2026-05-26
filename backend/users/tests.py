from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from django.urls import reverse

from restaurants.models import Restaurant
from users.serializers import PasswordResetConfirmSerializer
from users.models import UserRole

User = get_user_model()


class AuthAPITests(APITestCase):
    def setUp(self):
        self.register_url = reverse('users:register')
        self.login_url = reverse('users:login')
        self.refresh_url = reverse('users:token_refresh')
        self.logout_url = reverse('users:logout')
        self.forgot_url = reverse('users:forgot_password')
        self.reset_url = reverse('users:reset_password')
        self.employee_url = reverse('users:employee-list')
        self.me_url = reverse('users:me')
        self.user = User.objects.create_user(
            email='user@example.com',
            password='Secret123!',
            full_name='Test User',
        )
        self.owner = User.objects.create_user(
            email='owner@example.com',
            password='OwnerSecret123!',
            full_name='Owner User',
            role=UserRole.OWNER,
        )
        self.restaurant = Restaurant.objects.create(
            owner=self.owner,
            name='Warung Test',
            slug='warung-test',
        )
        self.owner.restaurant = self.restaurant
        self.owner.save(update_fields=['restaurant'])
        self.cashier = User.objects.create_user(
            email='cashier@example.com',
            password='CashierSecret123!',
            full_name='Cashier User',
            role=UserRole.CASHIER,
            restaurant=self.restaurant,
            employee_code='KSR-TEST001',
            pin_code='1234',
        )

    def test_register_creates_user_and_returns_tokens(self):
        payload = {
            'email': 'newuser@example.com',
            'password': 'NewSecret123!',
            'full_name': 'New User',
            'phone_number': '08123456789',
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertEqual(response.data['user']['email'], payload['email'])

    def test_login_returns_tokens(self):
        response = self.client.post(
            self.login_url,
            {'email': self.user.email, 'password': 'Secret123!'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data['tokens'])
        self.assertEqual(response.data['user']['email'], self.user.email)

    def test_refresh_and_logout_flow(self):
        login_response = self.client.post(
            self.login_url,
            {'email': self.user.email, 'password': 'Secret123!'},
            format='json',
        )
        refresh_token = login_response.data['tokens']['refresh']
        access_token = login_response.data['tokens']['access']

        refresh_response = self.client.post(
            self.refresh_url,
            {'refresh': refresh_token},
            format='json',
        )
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_response.data)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_response = self.client.post(
            self.logout_url,
            {'refresh': refresh_token},
            format='json',
        )
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)

    def test_password_reset_flow(self):
        token_payload = PasswordResetConfirmSerializer.build_token_payload(self.user)
        response = self.client.post(
            self.reset_url,
            {
                **token_payload,
                'new_password': 'ResetSecret123!',
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        login_response = self.client.post(
            self.login_url,
            {'email': self.user.email, 'password': 'ResetSecret123!'},
            format='json',
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)

    def test_forgot_password_returns_ok_even_if_email_unknown(self):
        response = self.client.post(
            self.forgot_url,
            {'email': 'missing@example.com'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_owner_can_create_employee_with_uuid_restaurant_id(self):
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(
            self.employee_url,
            {
                'email': 'new-cashier@example.com',
                'full_name': 'Cashier User',
                'phone_number': '081234567890',
                'role': UserRole.CASHIER,
                'pin_code': '123456',
                'is_active': True,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['employee_code'].startswith('KSR-'))
        self.assertEqual(len(response.data['employee_code']), len('KSR-') + 6 + 3)

    def test_cashier_can_update_own_pin_via_me_endpoint(self):
        self.client.force_authenticate(user=self.cashier)
        response = self.client.put(
            self.me_url,
            {
                'full_name': self.cashier.full_name,
                'email': self.cashier.email,
                'phone_number': self.cashier.phone_number,
                'pin_code': '567890',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.cashier.refresh_from_db()
        self.assertEqual(self.cashier.pin_code, '567890')

# Create your tests here.
