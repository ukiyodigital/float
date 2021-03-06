from django.db import models
from django.contrib.postgres.fields import JSONField
from django.core.serializers.json import DjangoJSONEncoder

from apps.sites.models import Site
from apps.column_headers.models import ColumnHeader
from apps.users.models import User

from apps.column_headers.utils import ColumnManager


class Page(models.Model):
    # page_name
    name = models.CharField(max_length=15, blank=False)
    slug = models.SlugField(max_length=15)

    # Foreign Keys
    site = models.ForeignKey(Site, on_delete=models.PROTECT, related_name='pages')
    users = models.ManyToManyField(User)

    class Meta:
        unique_together = ('slug', 'site',)

    def update_columns(self, columns):
        manager = ColumnManager(
            model=PageColumnHeader,
            column_fields=['name', 'slug', 'order', 'field', 'data'],
        )
        manager.save_columns(columns, self.id)

class PageColumnHeader(ColumnHeader):
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='columns', null=True, blank=True)
    data = JSONField(null=True, blank=True, encoder=DjangoJSONEncoder)

    class Meta:
        # columns cannot have the same parent
        unique_together = (
            ('page', 'slug',),
            ('parent', 'slug',),
        )
