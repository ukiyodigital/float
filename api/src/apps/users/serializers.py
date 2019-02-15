from rest_framework.serializers import ModelSerializer, SerializerMethodField
from django.conf import settings

from apps.users.models import User


class UserSerializer(ModelSerializer):
    """
    Same as UserSerializer without badge and org
    """
    name = SerializerMethodField()

    class Meta:
        model = User

        fields = (
            "username",
            "name",
            "email",
            "profile_img",
            "is_superuser",
        )

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

