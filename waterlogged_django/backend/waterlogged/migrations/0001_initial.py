# Generated by Django 2.0.2 on 2020-02-07 02:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Images',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, unique=True)),
                ('name', models.TextField()),
                ('long', models.TextField()),
                ('latt', models.TextField()),
                ('paired_id', models.IntegerField()),
                ('filePath', models.FilePathField()),
            ],
        ),
    ]
