# Generated by Django 3.0.3 on 2020-04-26 22:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('waterlogged', '0028_auto_20200426_0941'),
    ]

    operations = [
        migrations.RenameField(
            model_name='image',
            old_name='filepath',
            new_name='blob_name',
        ),
    ]
