from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalogs', '0002_alter_category_options_alter_menuitem_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='menuitem',
            name='discount_percentage',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='menuitem',
            name='is_new',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='menuitem',
            name='tax_percentage',
            field=models.PositiveSmallIntegerField(default=10),
        ),
        migrations.AddField(
            model_name='menuitem',
            name='track_stock',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='menuitem',
            name='variants',
            field=models.JSONField(blank=True, default=list),
        ),
    ]