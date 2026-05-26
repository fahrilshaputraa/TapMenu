from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0002_restaurant_closing_time_restaurant_opening_time_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurantappearance',
            name='bg_color',
            field=models.CharField(default='#F7F5F2', max_length=20),
        ),
        migrations.AddField(
            model_name='restaurantappearance',
            name='bg_pattern',
            field=models.CharField(default='pattern-none', max_length=50),
        ),
        migrations.AddField(
            model_name='restaurantappearance',
            name='button_style',
            field=models.CharField(default='circle', max_length=20),
        ),
        migrations.AddField(
            model_name='restaurantappearance',
            name='card_radius',
            field=models.PositiveSmallIntegerField(default=12),
        ),
        migrations.AddField(
            model_name='restaurantappearance',
            name='card_shadow',
            field=models.PositiveSmallIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='restaurantappearance',
            name='font_style',
            field=models.CharField(default='Plus Jakarta Sans', max_length=100),
        ),
        migrations.AddField(
            model_name='restaurantappearance',
            name='header_style',
            field=models.CharField(default='standard', max_length=20),
        ),
        migrations.AddField(
            model_name='restaurantappearance',
            name='layout_style',
            field=models.CharField(default='list', max_length=20),
        ),
        migrations.AddField(
            model_name='restaurantappearance',
            name='show_banner',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='restaurantappearance',
            name='show_description',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='restaurantappearance',
            name='show_images',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='restaurantappearance',
            name='show_profile',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='restaurantappearance',
            name='cover_image_url',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='restaurantappearance',
            name='logo_url',
            field=models.TextField(blank=True),
        ),
    ]
