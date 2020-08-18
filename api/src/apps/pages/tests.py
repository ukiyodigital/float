from graphql_jwt.testcases import JSONWebTokenTestCase

from apps.pages import schema
from apps.users.models import User


class PageTests(JSONWebTokenTestCase):
    fixtures = ['apps/float/data/fixtures.json',]

    def setUp(self):
        self.user = User.objects.get(username='testuser')
        self.client.authenticate(self.user)

    def test_get_page(self):
        query = '''
        query GetPage($siteSlug: String!, $pageSlug: String!) {
            page(siteSlug: $siteSlug, pageSlug: $pageSlug) {
                name
                slug
            }
        }'''
        variables = {
            'siteSlug': 'portfolio',
            'pageSlug': 'home',
        }

        executed = self.client.execute(query, variables)
        expected = {
            'page': {
                'name': 'Home',
                'slug': 'home',
            }
        }
        self.assertDictEqual(executed.data, expected)
