from django.db import models, IntegrityError
from apps.users.models import User

from secrets import token_urlsafe

class Site(models.Model):
    # site_name
    name = models.CharField(max_length=15, blank=False)
    slug = models.SlugField(max_length=15)

    # Foreign Keys
    owner = models.ForeignKey(User, on_delete=models.PROTECT, related_name="sites")
    users = models.ManyToManyField(User)

    class Meta:
        unique_together = ('slug', 'owner',)

    @classmethod
    def create(cls, name, slug, owner):
        """
        Tries to create a site, then creates a unique API key
        """
        try:
            site = cls(name=name, slug=slug, owner=owner)
            site.save()

            created_unique_key = False
            while not created_unique_key:
                key = token_urlsafe(20)
                if not SiteAPIKey.objects.filter(key=key).exists() and len(key) <= 32:
                    api_key = SiteAPIKey(key=key, site=site)
                    api_key.save()
                    created_unique_key = True

            return site
        # could be duplicate
        except IntegrityError as e:
            raise Exception('Could not save with given slug and owner')


class SiteAPIKey(models.Model):
    key = models.CharField(max_length=32, unique=True)
    site = models.ForeignKey(Site, on_delete=models.PROTECT, related_name="api_key")
