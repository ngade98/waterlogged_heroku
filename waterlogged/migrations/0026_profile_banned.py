# Generated by Django 3.0.3 on 2020-04-18 18:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('waterlogged', '0025_profile_approved_by_admin'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='banned',
            field=models.BooleanField(default=False),
        ),
    ]