# Generated by Django 3.0.3 on 2020-03-31 19:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('waterlogged', '0013_auto_20200328_2023'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='temp',
            name='content',
        ),
        migrations.RemoveField(
            model_name='temp',
            name='title',
        ),
    ]