# Generated by Django 3.0.3 on 2020-03-19 23:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('waterlogged', '0008_auto_20200319_1632'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='pair_attempted',
            field=models.BooleanField(default=False),
        ),
    ]
