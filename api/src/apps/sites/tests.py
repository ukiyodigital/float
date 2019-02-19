from django.test import TestCase

# Create your tests here.
import json
from django.conf import settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from rest_framework.authtoken.models import Token

from apps.users.models import User
from apps.sites.models import Site
from apps.sites.serializers import SiteDetailSerializer


class SiteTestCase(APITestCase):
    """
    python ./manage.py test apps/users
    """
    def setUp(self):
        self.user = User.objects.create_user("testuser", "password")
        token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

    """
    TODO
    1. Test create site
    2. Test update site
    3. Test delete site
    4. Test list site
    5. Test cannot get access to sites not owned
    """
    def test_can_create_site(self):
        data = {
            "name": "Test Site",
            "slug": "test-site"
        }

        response = self.client.post(reverse("sites_list"), json.dumps(data), content_type="application/json")

        site = Site.objects.filter(slug="test-site", owner=self.user).first()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, SiteDetailSerializer(site).data)


