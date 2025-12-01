from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from django.urls import reverse

from users.serializers import PasswordResetConfirmSerializer

User = get_user_model()


class AuthAPITests(APITestCase):
    def setUp(self):
        self.register_url = reverse('users:register')
        self.login_url = reverse('users:login')
        self.refresh_url = reverse('users:token_refresh')
        self.logout_url = reverse('users:logout')
        self.forgot_url = reverse('users:forgot_password')
        self.reset_url = reverse('users:reset_password')
        self.user = User.objects.create_user(
            email='user@example.com',
            password='Secret123!',
            full_name='Test User',
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

# Create your tests here.
