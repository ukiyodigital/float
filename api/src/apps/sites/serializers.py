from rest_framework import serializers
from secrets import token_urlsafe

from apps.users.models import User
from apps.sites.models import SiteAPIKey, Site
from apps.users.serializers import UserListSerializer


class SiteCreateSerializer(serializers.ModelSerializer):
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
        site = Site(**validated_data)
        site.owner = self.context.get("request").user

        created_unique_key = False
        while not created_unique_key:
            key = token_urlsafe(20)
            if not SiteAPIKey.objects.filter(key=key).exists() and len(key) <= 32:
                api_key = SiteAPIKey(key=key)
                api_key.save()
                site.api_key = api_key
                created_unique_key = True
        site.save()
        return Site


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
    api_key = SiteAPIKeySerializer()
    owner = UserListSerializer()

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

