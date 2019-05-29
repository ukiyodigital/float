# Generated by Django 2.1.8 on 2019-05-28 06:18

import django.contrib.postgres.fields.jsonb
import django.core.serializers.json
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=15)),
                ('slug', models.SlugField(max_length=15)),
            ],
        ),
        migrations.CreateModel(
            name='PageColumnHeader',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=15)),
                ('type', models.CharField(choices=[('text', 'Text'), ('number', 'Number'), ('long_text', 'Long Text'), ('html', 'html'), ('url', 'URL'), ('image', 'Image')], default='text', max_length=50)),
                ('order', models.PositiveSmallIntegerField(default=0)),
                ('slug', models.SlugField(max_length=15)),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(blank=True, encoder=django.core.serializers.json.DjangoJSONEncoder, null=True)),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='columns', to='pages.Page')),
            ],
        ),
    ]
