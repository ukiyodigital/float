from rest_framework import serializers

from apps.column_headers.serializers import ColumnHeaderSerializer
from apps.users.serializers import UserListSerializer


class PageDataWriteSerializer(serializers.ModelSerializer):
    """
    Given a list of data, store it in the data field
    """
    users = UserListSerializer(many=True)
    columns = ColumnHeaderSerializer(many=True)

    class Meta:
        model = Site

        fields = (
            'name',
            'slug',
            'data',
            'users',
            'columns'
        )

    # TODO create a create method for storing the data values


class PageSerializer(serializers.ModelSerializer):
    """
    Serializes the given page
    """
    users = UserListSerializer(many=True)

    class Meta:
        model = Site

        fields = (
            'name',
            'slug',
            'data',
            'users',
            'columns'
        )


