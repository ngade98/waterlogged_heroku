# Generated by Django 3.0.3 on 2020-04-10 16:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('waterlogged', '0017_auto_20200409_2242'),
    ]

    operations = [
        migrations.AlterField(
            model_name='temp',
            name='latitude',
            field=models.FloatField(default=1.0),
        ),
        migrations.AlterField(
            model_name='temp',
            name='longitude',
            field=models.FloatField(default=1.0),
        ),
    ]
