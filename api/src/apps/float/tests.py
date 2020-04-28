import json

from django.test import TestCase

from apps.sites.models import Site
from apps.pages.models import Page
from apps.users.models import User

class AppTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

    @classmethod
    def setUpTestData(cls):
        with open("/app/apps/float/data/mockdata.json") as f:
            mock_data = json.loads(f.read())

        cls.client = APIClient()
        cls.mock_users_data = mock_data["users"]
        cls.users = cls._create_users(mock_data["users"])
        cls.sites = cls._create_sites(mock_data["sites"])
        cls.pages = cls._create_pages(mock_data["pages"])

    @classmethod
    def _create_users(cls, mock_users):
        for user in mock_users:
            serializer = CreateUserSerializer(data=user)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return User.objects.all()

    @classmethod
    def _create_sites(cls, mock_sites):
        for idx, site in enumerate(mock_sites):
            site = Site.create(**site)
            site.owner = cls.users[idx]
            site.save()

        return Site.objects.all()

    @classmethod
    def _create_pages(cls, mock_pages):
        for idx, page in enumerate(mock_pages):
            page = Page(**page)
            page.site = cls.sites[idx]
            page.save()

        return Page.objects.all()
