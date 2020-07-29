from django.db import models
from django.core.validators import validate_slug

class ColumnHeaderField:
    TEXT = "TEXT"
    MARKDOWN = "MARKDOWN"
    IMAGE = "IMAGE"

    CHOICES = (
        (TEXT, "Text"),
        (IMAGE, "Image"),
        (MARKDOWN, "Markdown"),
    )

class ColumnHeader(models.Model):
    name = models.CharField(max_length=50, blank=False)
    field = models.CharField(max_length=25, default=ColumnHeaderField.TEXT, choices=ColumnHeaderField.CHOICES)
    order = models.PositiveSmallIntegerField(default=0)
    slug = models.SlugField(max_length=25)

    class Meta:
        abstract = True
