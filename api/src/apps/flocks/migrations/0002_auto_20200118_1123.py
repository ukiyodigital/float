# Generated by Django 2.2.3 on 2020-01-18 19:23

import django.contrib.postgres.fields
import django.contrib.postgres.fields.jsonb
import django.core.serializers.json
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('flocks', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flock',
            name='data',
            field=django.contrib.postgres.fields.ArrayField(base_field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, encoder=django.core.serializers.json.DjangoJSONEncoder, null=True), blank=True, null=True, size=None),
        ),
    ]