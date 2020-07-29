from django.db import models
from django.core.validators import validate_slug

class ColumnHeaderField:
    TEXT = "TEXT"
    RICH_TEXT = "RICH_TEXT"
    IMAGE = "IMAGE"

    CHOICES = (
        (TEXT, "Text"),
        (IMAGE, "Image"),
        (RICH_TEXT, "Rich Text"),
    )

class ColumnHeader(models.Model):
    name = models.CharField(max_length=50, blank=False)
    field = models.CharField(max_length=25, default=ColumnHeaderField.TEXT, choices=ColumnHeaderField.CHOICES)
    order = models.PositiveSmallIntegerField(default=0)
    slug = models.SlugField(max_length=25)

    class Meta:
        abstract = True
