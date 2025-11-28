from django.db import models
from django.utils.text import slugify

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
    TYPE_CHOICES = [
        ('menu', 'Menu'),
        ('table', 'Table'),
    ]
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    slug = models.SlugField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="FontAwesome class")
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='menu')
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

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
    variants = models.JSONField(default=list, blank=True)
    discount = models.IntegerField(default=0)
    tax = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    stock_quantity = models.IntegerField(null=True, blank=True)
    is_new = models.BooleanField(default=False)
    is_favorite = models.BooleanField(default=False)

    def __str__(self):
        return self.name
