from django.db import models
from apps.users.models import User

from secrets import token_urlsafe


class SiteAPIKey(models.Model):
    key = models.CharField(max_length=32, unique=True)

class Site(models.Model):
    # site_name
    name = models.CharField(max_length=15, blank=False)
    slug = models.SlugField(max_length=15)

    # Foreign Keys
    owner = models.ForeignKey(User, on_delete=models.PROTECT, related_name="sites")
    users = models.ManyToManyField(User)
    api_key = models.ForeignKey(SiteAPIKey, on_delete=models.PROTECT, related_name="sites")

    class Meta:
        unique_together = ('slug', 'owner',)

    @classmethod
    def create(cls, name, slug):
        site = cls(name=name, slug=slug)

        created_unique_key = False
        while not created_unique_key:
            key = token_urlsafe(20)
            if not SiteAPIKey.objects.filter(key=key).exists() and len(key) <= 32:
                api_key = SiteAPIKey(key=key)
                api_key.save()
                site.api_key = api_key
                created_unique_key = True

        return site
