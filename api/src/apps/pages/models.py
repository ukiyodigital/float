from django.db import models
from django.contrib.postgres.fields import JSONField
from django.core.serializers.json import DjangoJSONEncoder

from apps.sites.models import Site
from apps.column_headers.models import ColumnHeader
from apps.users.models import User


class Page(models.Model):
    # page_name
    name = models.CharField(max_length=15, blank=False)
    slug = models.SlugField(max_length=15)

    data = JSONField(null=True, encoder=DjangoJSONEncoder)

    # Foreign Keys
    site = models.ForeignKey(Site, on_delete=models.PROTECT, related_name='pages')
    users = models.ManyToManyField(User)

    class Meta:
        unique_together = ('slug', 'site',)

class PageColumnHeader(ColumnHeader):
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='columns')

    class Meta:
        unique_together = ('page', 'slug',)
