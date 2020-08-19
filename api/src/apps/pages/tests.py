from graphql_jwt.testcases import JSONWebTokenTestCase

from apps.pages import schema
from apps.pages.models import Page
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

    def test_create_page(self):
        query = '''
        mutation CreatePage($page: PageInput!, $siteId: Int!) {
            createPage(page: $page, siteId: $siteId) {
                page {
                    name
                    slug
                    columns {
                        name
                    }
                }
            }
        }'''
        variables = {
            'page': {
                'name': 'Test Page',
                'slug': 'test_page',
            },
            'siteId': 1,
        }

        self.assertFalse(Page.objects.filter(slug='test_page', site_id=1).exists())

        executed = self.client.execute(query, variables)
        expected = {
            'page': {
                'name': 'Test Page',
                'slug': 'test_page',
                'columns': [],
            }
        }

        self.assertDictEqual(executed.data['createPage'], expected)
        self.assertTrue(Page.objects.filter(slug='test_page', site_id=1).exists())

    def test_update_page_no_new_columns(self):
        query = '''
        mutation UpdatePage($page: PageInput!, $siteId: Int!) {
            updatePage(page: $page, siteId: $siteId) {
                page {
                    id
                    name
                    slug
                    columns {
                        id
                    }
                }
            }
        }'''
        variables = {
            'page': {
                'id': '1',
                'name': 'Home Updated',
                'slug': 'new',
                'columns': [],
            },
            'siteId': 1,
        }

        self.assertTrue(Page.objects.filter(id=1, slug='home', site_id=1).exists())

        executed = self.client.execute(query, variables)
        expected = {
            'page': {
                'id': '1',
                'name': 'Home Updated',
                'slug': 'new',
                'columns': [],
            }
        }

        print(executed.data)

        self.assertDictEqual(executed.data['updatePage'], expected)
        self.assertTrue(Page.objects.filter(id=1, slug='new', site_id=1).exists())
