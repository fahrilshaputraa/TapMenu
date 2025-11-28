from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Restaurant, Category, Product

class RestaurantAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.restaurant = Restaurant.objects.create(
            name='Test Resto',
            slug='test-resto',
            description='A test restaurant',
            logo_url='http://example.com/logo.png',
            banner_url='http://example.com/banner.png'
        )
        self.category = Category.objects.create(
            restaurant=self.restaurant,
            name='Food',
            slug='food',
            icon='fa-food'
        )
        self.product = Product.objects.create(
            restaurant=self.restaurant,
            category=self.category,
            name='Fried Rice',
            price=20000,
            image_url='http://example.com/rice.png'
        )

    def test_get_restaurant_details(self):
        url = reverse('restaurant-detail', kwargs={'slug': 'test-resto'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Resto')
        self.assertEqual(len(response.data['products']), 1)
        self.assertEqual(response.data['products'][0]['name'], 'Fried Rice')

    def test_create_product_with_variants(self):
        url = reverse('product-list')
        data = {
            'restaurant': self.restaurant.id,
            'category': self.category.id,
            'name': 'Spicy Chicken',
            'price': 30000,
            'variants': [{'name': 'Level', 'options': [{'name': 'Hot', 'price': 0}]}],
            'discount': 10,
            'is_new': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['variants'][0]['name'], 'Level')
        self.assertTrue(response.data['is_new'])
