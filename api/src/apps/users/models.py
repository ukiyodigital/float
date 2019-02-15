from django.conf import settings
from django.db import models
from django.contrib.postgres.fields import JSONField
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Meta:
        app_label = "users"

    profile_img = models.CharField(max_length=6, blank=False)
    # custom_fields
    data = JSONField(null=True, encoder=DjangoJSONEncoder)
