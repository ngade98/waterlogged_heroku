# Generated by Django 3.0.3 on 2020-04-09 21:30

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('waterlogged', '0014_auto_20200331_1910'),
    ]

    operations = [
        migrations.AddField(
            model_name='temp',
            name='flood_date',
            field=models.DateTimeField(blank=True, default=datetime.datetime.now),
        ),
        migrations.AddField(
            model_name='temp',
            name='latitude',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='temp',
            name='longitude',
            field=models.FloatField(default=0.0),
        ),
    ]
