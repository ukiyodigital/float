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
from apps.pages.models import Page
from apps.sites.serializers import SiteDetailSerializer, SiteListSerializer
from apps.pages.serializers import PageSerializer


class SiteTestCase(APITestCase):
    """
    python ./manage.py test apps/users
    """
    def setUp(self):
        self.user = User.objects.create_user("testuser", "password")
        token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.site = Site.create(name="I Love Cats", slug="i-love-cats")
        self.site.owner = self.user
        self.site.save()

    """
    TODO
    1. Test create page
    2. Test update site
    3. Test delete site
    4. Test list site
    5. Test cannot get access to sites not owned
    """
    def test_can_create_site(self):
        data = {
            "name": "Test Page",
            "slug": "test-page",
            "columns": [{
                "name": "Title",
                "type": "text",
                "order": 1,
                "slug": "test"
            }]
        }

        kwargs = {
            "slug": "i-love-cats"
        }

        response = self.client.post(reverse("sites:pages:list_create_page", kwargs=kwargs), json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, PageSerializer(self.site.pages.filter(slug="test-page").first()).data)

    def test_can_list_pages(self):
        pass
