from django.conf import settings
from django.db import models
from django.db.models import QuerySet, Q
from django.utils.functional import cached_property
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Meta:
        app_label = "users"

    name = models.CharField(max_length=50, blank=False)
    profile_img = models.CharField(max_length=6, blank=False)
    # sites
    # custom_fields
    # data
