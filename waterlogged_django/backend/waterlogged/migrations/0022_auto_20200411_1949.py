# Generated by Django 3.0.3 on 2020-04-11 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('waterlogged', '0021_auto_20200410_1820'),
    ]

    operations = [
        migrations.CreateModel(
            name='Pre',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='pre_images')),
            ],
        ),
        migrations.AlterField(
            model_name='temp',
            name='image',
            field=models.ImageField(upload_to='post_images'),
        ),
    ]
