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
from apps.sites.serializers import SiteDetailSerializer, SiteListSerializer


class SiteTestCase(AppTestCase):
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

        response = self.client.post(reverse("sites:sites_list"), json.dumps(data), content_type="application/json")

        site = Site.objects.filter(slug="test-site", owner=self.user).first()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, SiteDetailSerializer(site).data)

    def test_can_update_site(self):
        data = {
            "name": "New Test Site",
            "slug": "new-test-site"
        }
        kwargs = {
            "slug": "i-love-cats"
        }

        original_site = self.site

        self.site.name = data["name"]
        self.site.slug = data["slug"]

        response = self.client.put(reverse("sites:site_detail", kwargs=kwargs), json.dumps(data), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["slug"], data["slug"])
        self.assertEqual(response.data["name"], data["name"])

    def test_can_list_sites(self):
        sites = Site.objects.filter(owner=self.user)
        response = self.client.get(reverse("sites:sites_list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, SiteListSerializer(sites, many=True).data)

    def test_can_delete_site(self):
        kwargs = {
            "slug": "i-love-cats"
        }

        response = self.client.delete(reverse("sites:site_detail", kwargs=kwargs), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, SiteDetailSerializer(self.site).data)
        self.assertEqual(Site.objects.filter(slug="i-love-cats").first(), None)
