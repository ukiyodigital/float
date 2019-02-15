from django.test import TestCase

# Create your tests here.
import json
from django.conf import settings
from django.urls import reverse
from rest_framework import status

from apps.users.models import User
from apps.users.serializers import UserSerializer


class UserTestCase(AppTestCase):
    """
    python ./manage.py test apps/users
    """
    def setUp(self):
        self.user = User.objects.get(username="tlhuang")
        self.client.force_login(user=self.user)
        self.user_count = User.objects.count()

    def tearDown(self):
        self.client.logout()

    def _test_auth(self, expected_username, expected_impersonator_username):
        auth = self.client.get(reverse("auth"), content_type="application/json")
        self.assertEqual(auth.data.get("username"), expected_username)

        impersonator = auth.data.get("impersonator", None)
        if expected_impersonator_username is None:
            self.assertIsNone(impersonator)
        else:
            self.assertIsNotNone(impersonator)
            self.assertEqual(impersonator.get("username"), expected_impersonator_username)

    def test_user_auth(self):
        url = reverse("auth")
        response = self.client.get(url, content_type="application/json")
        user = User.objects.get(username=self.user.username)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, UserSerializer(user).data)
