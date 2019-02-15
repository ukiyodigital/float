from rest_framework.serializers import ModelSerializer, ListSerializer, SerializerMethodField
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.conf import settings

from apps.users.models import User


class UsernameSerializer(ModelSerializer):
    """
    Used for updating Requests
    """
    class Meta:
        model = User
        fields = (
            "username",
        )

        # doing this so that username uniqueness isn't checked when validating if this is a nested serializer
        # https://medium.com/django-rest-framework/dealing-with-unique-constraints-in-nested-serializers-dade33b831d9
        extra_kwargs = {
            'username': {
                'validators': [UnicodeUsernameValidator()],
            }
        }


class UserSerializer(ModelSerializer):
    """
    Serializer used for User's list
    """
    display_name = SerializerMethodField()

    class Meta:
        model = User

        fields = (
            "username",
            "display_name",
            "badge",
            "org",
            "telephone_number",
            "email",
            "is_superuser",
            "can_assign",
            "can_be_assigned",
            "is_read_only"
        )

    def get_display_name(self, obj):
        return obj.display_name or f"{obj.first_name} {obj.last_name}"


class LiteUserSerializer(ModelSerializer):
    """
    Same as UserSerializer without badge and org
    """
    display_name = SerializerMethodField()

    class Meta:
        model = User

        fields = (
            "username",
            "display_name",
            "is_superuser",
            "can_assign",
            "can_be_assigned"
        )

    def get_display_name(self, obj):
        return obj.display_name or f"{obj.first_name} {obj.last_name}"

