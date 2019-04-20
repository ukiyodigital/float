from rest_framework import serializers

from apps.pages.models import Page, PageColumnHeader
from apps.column_headers.serializers import ColumnHeaderSerializer
from apps.users.serializers import UserListSerializer


class PageSerializer(serializers.ModelSerializer):
    """
    Serializes the given page
    """

    class Meta:
        model = Page

        fields = (
            'name',
            'slug',
        )

    def create(self, validated_data):
        validated_data["site"] = self.context["site"]
        page = Page(**validated_data)
        page.save()

        return page


class PageDetailSerializer(serializers.ModelSerializer):
    """
    Returns the columns and general data of a page
    """

    class Meta:
        model = Page

        fields = (
            'name',
            'slug',
            'columns',
        )
