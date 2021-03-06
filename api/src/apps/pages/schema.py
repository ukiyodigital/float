import graphene
import json
from graphene.types import generic

from graphene_django import DjangoObjectType

from graphql import GraphQLError
from graphql_jwt.decorators import login_required

from django.db import IntegrityError
from django.db.models import Q

import json

from apps.pages.models import Page, PageColumnHeader
from apps.sites.models import Site
from apps.uploads.models import FileUpload

# this should be moved outside of the schema file at some point
def loop_thru_data(columns):
    data = {}
    for column in columns:
        if (column.field == 'IMAGE'):
            image = FileUpload.objects.get(id=column.data.get('id'))
            column.data['url'] = image.file.url
            data[column.slug] = column.data
        if (column.field == 'OBJECT'):
            column_data = {}
            subcolumns = column.columns.all()
            column_data = loop_thru_data(subcolumns)
            data[column.slug] = column_data
        else:
            data[column.slug] = column.data

    return data

class ColumnInput(graphene.InputObjectType):
    id = graphene.String()
    name = graphene.String(required=True)
    slug = graphene.String(required=True)
    field = graphene.String(required=True)
    data = graphene.JSONString()
    columns = graphene.List(lambda: ColumnInput)

    # meta data columns
    order = graphene.Int()
    page_id = graphene.Int(name='page_id')
    parent_id = graphene.Int(name='parent_id')

class PageInput(graphene.InputObjectType):
    id = graphene.String()
    name = graphene.String(required=True)
    slug = graphene.String(required=True)
    columns = graphene.List(ColumnInput)

class PageType(DjangoObjectType):
    class Meta:
        model = Page

class PageAPIType(DjangoObjectType):
    class Meta:
        model = Page

    data = generic.GenericScalar()

    def resolve_data(self, info):
        columns = self.columns.all()
        return loop_thru_data(columns)

class PageColumnHeaderType(DjangoObjectType):
    data = generic.GenericScalar()

    class Meta:
        model = PageColumnHeader


class Query(graphene.ObjectType):
    page = graphene.Field(
        PageType,
        site_slug=graphene.String(required=True),
        page_slug=graphene.String(required=True),
    )
    page_by_key = graphene.Field(
        PageAPIType,
        api_key=graphene.String(required=True),
        page_slug=graphene.String(required=True),
    )

    @login_required
    def resolve_page(self, info, site_slug, page_slug):
        try:
            page = Page.objects.get(
                site__slug=site_slug,
                slug=page_slug,
                site__owner=info.context.user,
            )
        except Page.DoesNotExist as e:
            raise GraphQLError(e)
        return page

    def resolve_page_by_key(self, info, api_key, page_slug):
        try:
            page = Page.objects.get(
                site__api_key__key=api_key,
                slug=page_slug,
            )
        except Page.DoesNotExist as e:
            raise GraphQLError(e)
        return page


class CreatePage(graphene.Mutation):
    page = graphene.Field(PageType)

    class Arguments:
        site_id = graphene.Int(required=True)
        page = PageInput(required=True)

    @login_required
    def mutate(self, info, site_id, page):
        try:
            page = Page(site_id=site_id, **page)
            page.save()
        except IntegrityError as e:
            raise GraphQLError(e)

        return CreatePage(page=page)


class UpdatePage(graphene.Mutation):
    page = graphene.Field(PageType)

    class Arguments:
        site_id = graphene.Int(required=True)
        page = PageInput(required=True)

    @login_required
    def mutate(self, info, site_id, page):
        try:
            page_obj = Page.objects.get(
                id=page.id,
                site__id=site_id,
                site__owner=info.context.user,
            )
        except Page.DoesNotExist as e:
            raise GraphQLError(e)

        page_obj.name = page.name
        page_obj.slug = page.slug

        columns = page.get("columns", [])
        page_obj.columns.exclude(id__in=[c.id for c in columns if c.id]).delete()

        try:
            page_obj.update_columns(columns)
        except IntegrityError:
            raise GraphQLError('Duplicate slugs found in same page or same column')

        page_obj.save()

        return UpdatePage(page=page_obj)


class DeletePage(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        site_id = graphene.Int(required=True)
        slug = graphene.String(required=True, description="Slug of page to be deleted")

    @login_required
    def mutate(self, info, site_id, slug):
        try:
            page = Page.objects.filter(
                slug=slug,
                site__id=site_id,
                site__owner=info.context.user,
            ).delete()
        except Exception as e:
            raise GraphQLError(e)
        return DeletePage(ok=True)


class Mutation(graphene.ObjectType):
    create_page = CreatePage.Field()
    update_page = UpdatePage.Field()
    delete_page = DeletePage.Field()
