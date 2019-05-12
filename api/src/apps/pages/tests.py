from django.test import TestCase

# Create your tests here.
import json
from django.conf import settings
from django.urls import reverse
from rest_framework import status

from rest_framework.authtoken.models import Token

from apps.float.tests import AppTestCase
from apps.users.models import User
from apps.sites.models import Site
from apps.pages.models import Page
from apps.sites.serializers import SiteDetailSerializer, SiteListSerializer
from apps.pages.serializers import PageSerializer


class SiteTestCase(AppTestCase):
    """
    python ./manage.py test apps/users
    """
    def setUp(self):
        super().setUp()

    """
    TODO
    1. Test create page
    2. Test update site
    3. Test delete site
    4. Test list site
    5. Test cannot get access to sites not owned
    """
    def test_can_create_page(self):
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
            "slug": self.sites[0].slug
        }

        response = self.client.post(reverse("sites:pages:list_create_page", kwargs=kwargs), json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, PageSerializer(self.sites[0].pages.filter(slug="test-page").first()).data)

    def test_can_list_pages(self):
        kwargs = {
            "slug": self.sites[0].slug
        }

        response = self.client.get(reverse("sites:pages:list_create_page", kwargs=kwargs))
        pages = self.sites[0].pages.all()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, PageSerializer(pages, many=True).data)
