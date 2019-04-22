# Generated by Django 2.1.7 on 2019-04-22 05:15

from django.conf import settings
import django.contrib.postgres.fields.jsonb
import django.core.serializers.json
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('sites', '0002_auto_20190218_1237'),
    ]

    operations = [
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=15)),
                ('slug', models.SlugField(max_length=15)),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(encoder=django.core.serializers.json.DjangoJSONEncoder, null=True)),
                ('site', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='pages', to='sites.Site')),
                ('users', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
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
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='columns', to='pages.Page')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='pagecolumnheader',
            unique_together={('page', 'slug')},
        ),
        migrations.AlterUniqueTogether(
            name='page',
            unique_together={('slug', 'site')},
        ),
    ]
