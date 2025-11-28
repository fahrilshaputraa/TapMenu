from django.core.management.base import BaseCommand
from restaurant.models import Restaurant, Category, Product

class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **kwargs):
        # Create Restaurant
        restaurant, created = Restaurant.objects.get_or_create(
            slug='warung-bu-dewi',
            defaults={
                'name': 'Warung Bu Dewi',
                'description': 'Warung makan dengan berbagai menu masakan Indonesia yang lezat dan terjangkau.',
                'address': 'Jl. Merdeka No. 123, Jakarta Selatan',
                'open_time': '08:00',
                'close_time': '22:00',
                'logo_url': 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png',
                'banner_url': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
            }
        )
        self.stdout.write(f'Restaurant "{restaurant.name}" created/fetched.')

        # Create Categories
        categories_data = [
            {'slug': 'makanan', 'name': 'Makanan', 'icon': 'fa-solid fa-utensils'},
            {'slug': 'minuman', 'name': 'Minuman', 'icon': 'fa-solid fa-mug-hot'},
            {'slug': 'cemilan', 'name': 'Cemilan', 'icon': 'fa-solid fa-cookie-bite'},
        ]

        category_map = {}
        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(
                restaurant=restaurant,
                slug=cat_data['slug'],
                defaults={
                    'name': cat_data['name'],
                    'icon': cat_data['icon']
                }
            )
            category_map[cat_data['slug']] = cat
        self.stdout.write('Categories created.')

        # Create Products
        menu_items = [
            {
                'name': "Nasi Goreng Spesial",
                'description': "Dengan telur mata sapi, sate ayam, dan kerupuk udang.",
                'price': 25000,
                'stock': True,
                'image_url': "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
                'category_slug': "makanan",
                'is_popular': True,
            },
            {
                'name': "Ayam Bakar Madu",
                'description': "Ayam kampung bakar dengan olesan madu dan sambal terasi.",
                'price': 28000,
                'stock': True,
                'image_url': "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80",
                'category_slug': "makanan",
                'is_popular': False,
            },
            {
                'name': "Sate Ayam Madura",
                'description': "10 tusuk sate ayam dengan bumbu kacang kental.",
                'price': 30000,
                'stock': True,
                'image_url': "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=400&q=80",
                'category_slug': "makanan",
                'is_popular': True,
            },
            {
                'name': "Es Kopi Susu Gula Aren",
                'description': "Kopi arabika house blend dengan susu fresh milk.",
                'price': 18000,
                'stock': True,
                'image_url': "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80",
                'category_slug': "minuman",
                'is_popular': False,
            },
            {
                'name': "Es Teh Manis Jumbo",
                'description': "Teh tubruk wangi melati dengan gula asli.",
                'price': 8000,
                'stock': True,
                'image_url': "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80",
                'category_slug': "minuman",
                'is_popular': False,
            },
            {
                'name': "Pisang Goreng Keju",
                'description': "Pisang kepok kuning digoreng crispy topping keju.",
                'price': 15000,
                'stock': True,
                'image_url': "https://images.unsplash.com/photo-1519708227418-c8fd9a3a2b7b?auto=format&fit=crop&w=400&q=80",
                'category_slug': "cemilan",
                'is_popular': False,
            }
        ]

        for item in menu_items:
            cat = category_map.get(item['category_slug'])
            Product.objects.get_or_create(
                restaurant=restaurant,
                name=item['name'],
                defaults={
                    'category': cat,
                    'description': item['description'],
                    'price': item['price'],
                    'stock': item['stock'],
                    'image_url': item['image_url'],
                    'is_popular': item['is_popular'],
                }
            )
        self.stdout.write('Products created.')
