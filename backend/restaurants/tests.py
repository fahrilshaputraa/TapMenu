from rest_framework import status
from rest_framework.test import APITestCase

from .models import Restaurant, RestaurantAppearance
from users.models import User, UserRole


class RestaurantAppearanceApiTests(APITestCase):
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
        self.client.force_authenticate(self.owner)

    def test_owner_can_save_extended_menu_appearance(self):
        response = self.client.put(
            '/api/v1/restaurants/appearance/',
            {
                'hero_title': 'Warung TapMenu',
                'hero_subtitle': 'Menu digital yang bisa diatur penuh',
                'primary_color': '#123456',
                'accent_color': '#654321',
                'font_style': 'Poppins',
                'bg_pattern': 'pattern-grid',
                'bg_color': '#FAF7F0',
                'layout_style': 'grid',
                'header_style': 'center',
                'show_banner': False,
                'show_profile': True,
                'show_images': False,
                'show_description': False,
                'card_radius': 20,
                'card_shadow': 3,
                'button_style': 'pill',
                'logo_url': 'data:image/png;base64,logo',
                'cover_image_url': 'data:image/png;base64,banner',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        appearance = RestaurantAppearance.objects.get(restaurant=self.restaurant)
        self.assertEqual(appearance.font_style, 'Poppins')
        self.assertEqual(appearance.bg_pattern, 'pattern-grid')
        self.assertEqual(appearance.layout_style, 'grid')
        self.assertFalse(appearance.show_banner)
        self.assertFalse(appearance.show_images)
        self.assertEqual(appearance.button_style, 'pill')
        self.assertEqual(appearance.logo_url, 'data:image/png;base64,logo')
