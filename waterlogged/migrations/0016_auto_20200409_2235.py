# Generated by Django 3.0.3 on 2020-04-09 22:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('waterlogged', '0015_auto_20200409_2130'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='temp',
            name='flood_date',
        ),
        migrations.AlterField(
            model_name='temp',
            name='image',
            field=models.ImageField(default=' ', upload_to='temp_images'),
        ),
    ]
