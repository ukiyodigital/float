from rest_framework import serializers

from apps.column_headers.models import ColumnHeader


class ColumnHeaderSerializer(serializers.ModelSerializer):
    """
    Given a list of data, store it in the data field
    """
    class Meta:
        model = ColumnHeader

        fields = (
            'name',
            'type',
            'order',
            'slug'
        )
