from rest_framework import serializers

from apps.pages.models import Page, PageColumnHeader
from apps.column_headers.serializers import ColumnHeaderSerializer
from apps.users.serializers import UserListSerializer


class PageSerializer(serializers.ModelSerializer):
    """
    Serializes the given page
    """
    columns = ColumnHeaderSerializer(many=True)

    class Meta:
        model = Page

        fields = (
            'name',
            'slug',
            'columns',
        )

    def create(self, validated_data):
        columns = validated_data.pop("columns", [])
        validated_data["site"] = self.context["site"]
        page = Page(**validated_data)
        page.save()

        for column in columns:
            column["page"] = page
            c = PageColumnHeader(**column)
            c.save()

        return page
