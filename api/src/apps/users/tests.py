from django.test import TestCase

# Create your tests here.
import json
from django.conf import settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.users.models import User
from rest_framework.authtoken.models import Token
from apps.users.serializers import UserSerializer, CreateUserSerializer


class UserTestCase(APITestCase):
    """
    python ./manage.py test apps/users
    """
    def setUp(self):
        data = {
            "username": "tester",
            "password": "password",
            "email": "tester@email.com"
        }
        serializer = CreateUserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

    def test_create_user(self):
        data = {
            "username": "testuser",
            "password": "password",
            "email": "test@email.com"
        }
        response = self.client.post(reverse("signup"), json.dumps(data), content_type="application/json")
        user = User.objects.get(username=data["username"])
        token = Token.objects.get(user=user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"token": token.key})

    def test_user_login(self):
        data = {
            "username": "tester",
            "password": "password"
        }
        response = self.client.post(reverse("login"), json.dumps(data), content_type="application/json")
        user = User.objects.get(username=data["username"])
        token = Token.objects.get(user=user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"token": token.key})
