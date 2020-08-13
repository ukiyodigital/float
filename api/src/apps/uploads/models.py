from django.db import models

from apps.sites.models import Site
from apps.float.storage_backends import MediaStorage


class FileUpload(models.Model):
    uploaded_at = models.DateTimeField(auto_now_add=True)
    site = models.ForeignKey(Site, on_delete=models.PROTECT, related_name="uploads")
    file = models.FileField(storage=MediaStorage())
