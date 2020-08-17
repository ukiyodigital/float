# Generated by Django 3.0.9 on 2020-08-12 23:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pagecolumnheader',
            name='field',
            field=models.CharField(choices=[('TEXT', 'Text'), ('IMAGE', 'Image'), ('MARKDOWN', 'Markdown')], default='TEXT', max_length=25),
        ),
        migrations.AlterField(
            model_name='pagecolumnheader',
            name='name',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='pagecolumnheader',
            name='slug',
            field=models.SlugField(max_length=25),
        ),
    ]
