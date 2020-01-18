from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField
from django.core.serializers.json import DjangoJSONEncoder

from apps.sites.models import Site
from apps.column_headers.models import ColumnHeader


class Flock(models.Model):
    name = models.CharField(max_length=15, blank=False)
    slug = models.SlugField(max_length=15)

    # where repeated data is stored
    data = ArrayField(
        JSONField(null=True, blank=True, encoder=DjangoJSONEncoder),
        blank=True,
        null=True,
    )

    # Foreign Keys
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='flocks')

    class Meta:
        unique_together = ('slug', 'site',)


class FlockColumnHeader(ColumnHeader):
    flock = models.ForeignKey(Flock, on_delete=models.CASCADE, related_name='columns')

    class Meta:
        unique_together = ('flock', 'slug',)
