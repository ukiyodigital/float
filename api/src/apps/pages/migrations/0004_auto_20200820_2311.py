# Generated by Django 3.0.9 on 2020-08-21 06:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0003_auto_20200820_1008'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pagecolumnheader',
            name='field',
            field=models.CharField(choices=[('TEXT', 'Text'), ('IMAGE', 'Image'), ('MARKDOWN', 'Markdown'), ('OBJECT', 'Object'), ('ARRAY', 'Array')], default='TEXT', max_length=25),
        ),
    ]