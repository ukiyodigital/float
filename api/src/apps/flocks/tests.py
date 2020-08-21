import json
from django.db import transaction
from graphql_jwt.testcases import JSONWebTokenTestCase

from apps.flocks.models import Flock, FlockColumnHeader
from apps.users.models import User


class FlockTests(JSONWebTokenTestCase):
    fixtures = ['apps/float/data/fixtures.json',]

    def setUp(self):
        self.user = User.objects.get(username='testuser')
        self.client.authenticate(self.user)

        self.getFlock = '''
        query GetFlock($siteSlug: String!, $flockSlug: String!) {
            flock(siteSlug: $siteSlug, flockSlug: $flockSlug) {
                name
                slug
                columns {
                    name
                    slug
                    field
                    columns {
                        name
                        slug
                        field
                    }
                }
            }
        }'''

        self.createFlock = '''
        mutation CreateFlock($flock: FlockInput!, $siteId: Int!) {
            createFlock(flock: $flock, siteId: $siteId) {
                flock {
                    name
                    slug
                    columns {
                        name
                    }
                }
            }
        }'''

        self.updateFlock = '''
        mutation UpdateFlock($flock: FlockInput!, $siteId: Int!) {
            updateFlock(flock: $flock, siteId: $siteId) {
                flock {
                    id
                    name
                    slug
                    columns {
                        name
                        slug
                        field
                        columns {
                            name
                            slug
                            field
                        }
                    }
                }
            }
        }'''

    def test_get_flock(self):
        variables = {
            'siteSlug': 'portfolio',
            'flockSlug': 'items',
        }

        executed = self.client.execute(self.getFlock, variables)
        expected = {
            'flock': {
                'name': 'Items',
                'slug': 'items',
                'columns': [
                    {
                        'name': 'About Section',
                        'slug': 'about',
                        'field': 'OBJECT',
                        'columns': [
                            {
                                'name': 'Header',
                                'slug': 'header',
                                'field': 'TEXT',
                            },
                        ],
                    },
                    {
                        'name': 'Description',
                        'slug': 'description',
                        'field': 'MARKDOWN',
                        'columns': [],
                    },
                    {
                        'name': 'Title',
                        'slug': 'title',
                        'field': 'TEXT',
                        'columns': [],
                    },
                ]
            }
        }


        data = executed.data
        columns = data['flock'].pop('columns')
        expectedColumns = expected['flock'].pop('columns')
        self.assertDictEqual(data, expected)
        self.assertSequenceEqual(columns, expectedColumns)


    def test_create_flock(self):
        variables = {
            'flock': {
                'name': 'Test Flock',
                'slug': 'test_flock',
            },
            'siteId': 1,
        }

        self.assertFalse(Flock.objects.filter(slug='test_flock', site_id=1).exists())

        executed = self.client.execute(self.createFlock, variables)
        expected = {
            'flock': {
                'name': 'Test Flock',
                'slug': 'test_flock',
                'columns': [],
            }
        }

        self.assertDictEqual(executed.data['createFlock'], expected)
        self.assertTrue(Flock.objects.filter(slug='test_flock', site_id=1).exists())

    def test_update_flock_no_new_columns(self):
        variables = {
            'flock': {
                'id': '1',
                'name': 'Home Updated',
                'slug': 'new',
                'columns': [],
            },
            'siteId': 1,
        }

        self.assertTrue(Flock.objects.filter(id=1, slug='items', site_id=1).exists())

        executed = self.client.execute(self.updateFlock, variables)
        expected = {
            'flock': {
                'id': '1',
                'name': 'Home Updated',
                'slug': 'new',
                'columns': [],
            }
        }

        self.assertDictEqual(executed.data['updateFlock'], expected)
        self.assertTrue(Flock.objects.filter(id=1, slug='new', site_id=1).exists())

    # def test_deletes_non_included(self):
    #     variables = {
    #         'page': {
    #             'id': '1',
    #             'name': 'Home',
    #             'slug': 'home',
    #             'columns': [{
    #                 'page_id': 1,
    #                 'name': 'Test 1',
    #                 'slug': 'test_1',
    #                 'field': 'TEXT',
    #                 'data': json.dumps({
    #                     'value': 'some value',
    #                 }),
    #             }],
    #         },
    #         'siteId': 1,
    #     }

    #     executed = self.client.execute(self.updatePage, variables)
    #     expected = {
    #         'page': {
    #             'id': '1',
    #             'name': 'Home',
    #             'slug': 'home',
    #             'columns': [{
    #                 'name': 'Test 1',
    #                 'slug': 'test_1',
    #                 'field': 'TEXT',
    #                 'data': {
    #                     'value': 'some value',
    #                 },
    #                 'columns': [],
    #             }],
    #         }
    #     }

    #     self.assertDictEqual(executed.data['updatePage'], expected)
    #     self.assertTrue(PageColumnHeader.objects.filter(slug='test_1', page_id=1).exists())


    # def test_update_with_columns(self):
    #     variables = {
    #         'page': {
    #             'id': '1',
    #             'name': 'Home',
    #             'slug': 'home',
    #             'columns': [{
    #                 'page_id': 1,
    #                 'name': 'Test 1',
    #                 'slug': 'test_1',
    #                 'field': 'TEXT',
    #                 'data': json.dumps({
    #                     'value': 'some value',
    #                 }),
    #             }],
    #         },
    #         'siteId': 1,
    #     }

    #     executed = self.client.execute(self.updatePage, variables)
    #     expected = {
    #         'page': {
    #             'id': '1',
    #             'name': 'Home',
    #             'slug': 'home',
    #             'columns': [{
    #                 'name': 'Test 1',
    #                 'slug': 'test_1',
    #                 'field': 'TEXT',
    #                 'data': {
    #                     'value': 'some value',
    #                 },
    #                 'columns': [],
    #             }],
    #         }
    #     }

    #     self.assertDictEqual(executed.data['updatePage'], expected)
    #     self.assertTrue(PageColumnHeader.objects.filter(slug='test_1', page_id=1).exists())

    # def test_add_sub_columns(self):
    #     variables = {
    #         'page': {
    #             'id': '1',
    #             'name': 'Home',
    #             'slug': 'home',
    #             'columns': [{
    #                 'page_id': 1,
    #                 'name': 'Test 1',
    #                 'slug': 'test_1',
    #                 'field': 'OBJECT',
    #                 'data': json.dumps({
    #                     'value': 'some value',
    #                 }),
    #                 'columns': [
    #                     {
    #                         'name': 'Test 1',
    #                         'slug': 'test_1',
    #                         'field': 'TEXT',
    #                         'data': json.dumps({
    #                             'value': 'some sub value',
    #                         }),
    #                     },
    #                     {
    #                         'name': 'Hello',
    #                         'slug': 'world',
    #                         'field': 'TEXT',
    #                         'data': json.dumps({
    #                             'value': 'test 3',
    #                         }),
    #                     }
    #                 ],
    #             }],
    #         },
    #         'siteId': 1,
    #     }

    #     executed = self.client.execute(self.updatePage, variables)
    #     expected = {
    #         'page': {
    #             'id': '1',
    #             'name': 'Home',
    #             'slug': 'home',
    #             'columns': [{
    #                 'name': 'Test 1',
    #                 'slug': 'test_1',
    #                 'field': 'OBJECT',
    #                 'data': {
    #                     'value': 'some value',
    #                 },
    #                 'columns': [
    #                     {
    #                         'name': 'Test 1',
    #                         'slug': 'test_1',
    #                         'field': 'TEXT',
    #                         'data': {
    #                             'value': 'some sub value',
    #                         },
    #                     },
    #                     {
    #                         'name': 'Hello',
    #                         'slug': 'world',
    #                         'field': 'TEXT',
    #                         'data': {
    #                             'value': 'test 3',
    #                         },
    #                     },
    #                 ],
    #             }],
    #         }
    #     }

    #     self.assertDictEqual(executed.data['updatePage'], expected)
    #     self.assertTrue(PageColumnHeader.objects.filter(slug='test_1').count() == 2)


    # def test_cannot_add_duplicate_child_slug(self):
    #     variables = {
    #         'page': {
    #             'id': '1',
    #             'name': 'Home',
    #             'slug': 'home',
    #             'columns': [
    #                 {
    #                     'page_id': 1,
    #                     'name': 'Test 1',
    #                     'slug': 'test_1',
    #                     'field': 'OBJECT',
    #                     'data': json.dumps({
    #                         'value': 'some value',
    #                     }),
    #                     'columns': [
    #                         {
    #                             'name': 'Test 1',
    #                             'slug': 'test_2',
    #                             'field': 'TEXT',
    #                             'data': json.dumps({
    #                                 'value': 'some sub value',
    #                             }),
    #                         },
    #                         {
    #                             'name': 'Hello',
    #                             'slug': 'test_2',
    #                             'field': 'TEXT',
    #                             'data': json.dumps({
    #                                 'value': 'test 3',
    #                             }),
    #                         }
    #                     ],
    #                 },
    #             ],
    #         },
    #         'siteId': 1,
    #     }

    #     with transaction.atomic():
    #         executed = self.client.execute(self.updatePage, variables)

    #         self.assertSequenceEqual(str(executed.errors[0]), 'Duplicate slugs found in same page or same column')

    #     self.assertTrue(PageColumnHeader.objects.filter(slug='test_1').count() == 0)
    #     self.assertTrue(PageColumnHeader.objects.filter(slug='test_2').count() == 0)


    # def test_cannot_add_duplicate_slug(self):
    #     variables = {
    #         'page': {
    #             'id': '1',
    #             'name': 'Home',
    #             'slug': 'home',
    #             'columns': [
    #                 {
    #                     'page_id': 1,
    #                     'name': 'Test 1',
    #                     'slug': 'test_1',
    #                     'field': 'TEXT',
    #                     'data': json.dumps({
    #                         'value': 'some value',
    #                     }),
    #                 },
    #                 {
    #                     'page_id': 1,
    #                     'name': 'Test 2',
    #                     'slug': 'test_1',
    #                     'field': 'TEXT',
    #                     'data': json.dumps({
    #                         'value': 'different value',
    #                     }),
    #                 },
    #             ],
    #         },
    #         'siteId': 1,
    #     }

    #     with transaction.atomic():
    #         executed = self.client.execute(self.updatePage, variables)

    #         self.assertSequenceEqual(str(executed.errors[0]), 'Duplicate slugs found in same page or same column')

    #     self.assertEqual(PageColumnHeader.objects.filter(slug='test_1').count(), 0)


    # def test_add_new_child_column_update_existing(self):
    #     variables = {
    #         'page': {
    #             'id': '1',
    #             'name': 'Home',
    #             'slug': 'home',
    #             'columns': [{
    #                 'id': 1,
    #                 'page_id': 1,
    #                 'name': 'Test 1',
    #                 'slug': 'test_1',
    #                 'field': 'OBJECT',
    #                 'data': json.dumps({}),
    #                 'columns': [
    #                     {
    #                         'id': 4,
    #                         'name': 'Child',
    #                         'slug': 'child_2',
    #                         'field': 'TEXT',
    #                         'data': json.dumps({}),
    #                     },
    #                     {
    #                         'name': 'Hello',
    #                         'slug': 'world',
    #                         'field': 'IMAGE',
    #                         'data': json.dumps({}),
    #                     }
    #                 ],
    #             }],
    #         },
    #         'siteId': 1,
    #     }

    #     executed = self.client.execute(self.updatePage, variables)
    #     expected = {
    #         'page': {
    #             'id': '1',
    #             'name': 'Home',
    #             'slug': 'home',
    #             'columns': [{
    #                 'name': 'Test 1',
    #                 'slug': 'test_1',
    #                 'field': 'OBJECT',
    #                 'data': {},
    #                 'columns': [
    #                     {
    #                         'name': 'Child',
    #                         'slug': 'child_2',
    #                         'field': 'TEXT',
    #                         'data': {},
    #                     },
    #                     {
    #                         'name': 'Hello',
    #                         'slug': 'world',
    #                         'field': 'IMAGE',
    #                         'data': {},
    #                     },
    #                 ],
    #             }],
    #         }
    #     }

    #     parent_column = PageColumnHeader.objects.get(id=1)

    #     self.assertDictEqual(executed.data['updatePage'], expected)
    #     self.assertEqual(parent_column.columns.count(), 2)
    #     self.assertTrue(parent_column.columns.filter(slug='child_2').exists())
    #     self.assertTrue(parent_column.columns.filter(slug='world').exists())
