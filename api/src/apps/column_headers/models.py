from django.db import models
from apps.column_headers.choice import Choice
from django.core.validators import validate_slug

class ColumnHeaderField(Choice):
    TEXT = "text"
    NUMBER = "number"
    LONG_TEXT = "long_text"
    HTML = "html"
    URL = "url"
    IMAGE = "image"

    CHOICES = (
        (TEXT, "Text"),
        (NUMBER, "Number"),
        (LONG_TEXT, "Long Text"),
        (HTML, "html"),
        (URL, "URL"),
        (IMAGE, "Image"),
    )

class ColumnHeader(models.Model):
    name = models.CharField(max_length=15, blank=False)
    field = models.CharField(max_length=50, default=ColumnHeaderField.TEXT, choices=ColumnHeaderField.CHOICES)
    order = models.PositiveSmallIntegerField(default=0)
    slug = models.SlugField(max_length=15)

    class Meta:
        abstract = True
