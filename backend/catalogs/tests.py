from decimal import Decimal

from rest_framework import status
from rest_framework.test import APITestCase

from restaurants.models import Restaurant, RestaurantAppearance
from users.models import User, UserRole

from .models import Category, MenuItem


class CatalogApiTests(APITestCase):
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
        self.client.force_authenticate(self.owner)

    def test_owner_can_create_category(self):
        response = self.client.post(
            '/api/v1/catalogs/categories/',
            {
                'name': 'Makanan Berat',
                'description': 'Menu utama restoran',
                'sort_order': 1,
                'is_active': True,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        category = Category.objects.get(name='Makanan Berat')
        self.assertEqual(category.restaurant, self.restaurant)
        self.assertEqual(category.sort_order, 1)

    def test_owner_can_create_menu_item_with_metadata(self):
        category = Category.objects.create(
            restaurant=self.restaurant,
            name='Minuman',
            sort_order=0,
            is_active=True,
        )

        response = self.client.post(
            '/api/v1/catalogs/items/',
            {
                'category': category.id,
                'name': 'Es Teh Jumbo',
                'description': 'Teh manis dingin ukuran besar',
                'price': '12000.00',
                'discount_percentage': 10,
                'tax_percentage': 11,
                'image_url': 'data:image/png;base64,fake-image-data',
                'track_stock': True,
                'stock_quantity': 25,
                'preparation_time_minutes': 5,
                'is_available': True,
                'is_featured': True,
                'is_new': True,
                'variants': [
                    {
                        'id': 'temperature',
                        'name': 'Suhu',
                        'type': 'radio',
                        'options': [
                            {'id': 'cold', 'name': 'Dingin', 'price': 0},
                            {'id': 'less-ice', 'name': 'Sedikit Es', 'price': 0},
                        ],
                    }
                ],
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        menu_item = MenuItem.objects.get(name='Es Teh Jumbo')
        self.assertEqual(menu_item.restaurant, self.restaurant)
        self.assertEqual(menu_item.category, category)
        self.assertEqual(menu_item.discount_percentage, 10)
        self.assertEqual(menu_item.tax_percentage, 11)
        self.assertTrue(menu_item.track_stock)
        self.assertEqual(menu_item.stock_quantity, 25)
        self.assertTrue(menu_item.is_featured)
        self.assertTrue(menu_item.is_new)
        self.assertEqual(menu_item.variants[0]['name'], 'Suhu')
        self.assertEqual(Decimal(response.data['effective_price']), Decimal('10800.000'))

    def test_public_menu_can_be_loaded_with_restaurant_uuid(self):
        appearance, _ = RestaurantAppearance.objects.get_or_create(restaurant=self.restaurant)
        appearance.font_style = 'Playfair Display'
        appearance.bg_pattern = 'pattern-dots'
        appearance.layout_style = 'grid'
        appearance.show_images = False
        appearance.button_style = 'pill'
        appearance.save()

        response = self.client.get(
            f'/api/v1/catalogs/public/menu/?restaurant={self.restaurant.id}',
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['restaurant']['id'], str(self.restaurant.id))
        self.assertEqual(response.data['restaurant']['name'], self.restaurant.name)
        self.assertEqual(response.data['restaurant']['appearance']['font_style'], 'Playfair Display')
        self.assertEqual(response.data['restaurant']['appearance']['bg_pattern'], 'pattern-dots')
        self.assertEqual(response.data['restaurant']['appearance']['layout_style'], 'grid')
        self.assertEqual(response.data['restaurant']['appearance']['show_images'], False)
        self.assertEqual(response.data['restaurant']['appearance']['button_style'], 'pill')

    def test_cashier_can_list_categories_and_items(self):
        category = Category.objects.create(
            restaurant=self.restaurant,
            name='Minuman',
            sort_order=0,
            is_active=True,
        )
        MenuItem.objects.create(
            restaurant=self.restaurant,
            category=category,
            name='Es Teh',
            price='10000.00',
            is_available=True,
        )

        self.client.force_authenticate(self.cashier)

        category_response = self.client.get('/api/v1/catalogs/categories/', format='json')
        item_response = self.client.get('/api/v1/catalogs/items/', format='json')

        self.assertEqual(category_response.status_code, status.HTTP_200_OK)
        self.assertEqual(item_response.status_code, status.HTTP_200_OK)
        category_results = category_response.data.get('results', category_response.data)
        item_results = item_response.data.get('results', item_response.data)
        self.assertEqual(len(category_results), 1)
        self.assertEqual(len(item_results), 1)

    def test_cashier_cannot_create_category(self):
        self.client.force_authenticate(self.cashier)
        response = self.client.post(
            '/api/v1/catalogs/categories/',
            {
                'name': 'Makanan Berat',
                'description': 'Menu utama restoran',
                'sort_order': 1,
                'is_active': True,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
