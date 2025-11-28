from django.db import models

class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    address = models.TextField(blank=True)
    open_time = models.TimeField(null=True, blank=True)
    close_time = models.TimeField(null=True, blank=True)
    logo = models.ImageField(upload_to='restaurant/logos/', null=True, blank=True)
    logo_url = models.URLField(max_length=500, blank=True)
    banner = models.ImageField(upload_to='restaurant/banners/', null=True, blank=True)
    banner_url = models.URLField(max_length=500, blank=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    slug = models.SlugField()
    icon = models.CharField(max_length=50, blank=True, help_text="FontAwesome class")

    def __str__(self):
        return self.name

class Product(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.BooleanField(default=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    image_url = models.URLField(max_length=500, blank=True)
    is_popular = models.BooleanField(default=False)

    def __str__(self):
        return self.name
