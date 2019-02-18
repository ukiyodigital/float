from django.db import models
from apps.users.models import User
# from secrets import token_urlsafe

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
