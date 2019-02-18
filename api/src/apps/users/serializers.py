from rest_framework.serializers import ModelSerializer, SerializerMethodField
from django.conf import settings

from apps.users.models import User

class CreateUserSerializer(ModelSerializer):
    class Meta:
        model = User

        fields = (
            "first_name",
            "last_name",
            "username",
            "email",
            "password"
        )

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserListSerializer(ModelSerializer):
    name = SerializerMethodField()
    class Meta:
        model = User

        fields = (
            "email",
            "profile_img",
            "name",
        )

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class UserSerializer(ModelSerializer):
    """
    Likely to provide data for currently logged in user
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

