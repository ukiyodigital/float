from django.db import IntegrityError

from rest_framework import serializers

from secrets import token_urlsafe

from apps.users.models import User
from apps.sites.models import SiteAPIKey, Site
from apps.users.serializers import UserListSerializer


class SiteWriteSerializer(serializers.ModelSerializer):
    """
    On successful validation of site, create an API Key for that site as well
    """
    class Meta:
        model = Site

        fields = (
            "name",
            "slug",
        )

    def create(self, validated_data):
        # TODO raise validation error if owner / slug already exists
        site = Site.create(**validated_data)
        site.owner = self.context.get("request").user

        try:
            site.save()
        except IntegrityError:
            raise serializers.ValidationError("This slug is already being used for this user.")
        return site


class SiteAPIKeySerializer(serializers.ModelSerializer):
    """
    On successful validation of site, create an API Key for that site as well
    """
    class Meta:
        model = SiteAPIKey

        fields = (
            "key",
        )


class SiteDetailSerializer(serializers.ModelSerializer):
    """
    TODO add pages and flocks to this serializer
    """
    api_key = serializers.SerializerMethodField()
    owner = UserListSerializer()
    users = UserListSerializer(many=True)


    class Meta:
        model = Site

        fields = (
            "id",
            "name",
            "slug",
            "api_key",
            "owner",
            "users",
        )

    def get_api_key(self, obj):
        return obj.api_key.key if obj.api_key else None


class SiteListSerializer(serializers.ModelSerializer):
    """
    For a simple list of sites
    """
    class Meta:
        model = Site

        fields = (
            "id",
            "name",
            "slug",
        )

