import graphene
from graphene.types import generic

from graphene_django import DjangoObjectType

from graphql import GraphQLError
from graphql_jwt.decorators import login_required

from django.db import IntegrityError
from django.db.models import Q

import json

from apps.pages.models import Page, PageColumnHeader
from apps.sites.models import Site


def get_page_column_header(column, page_id):
    value = column.pop('value', '')
    col = PageColumnHeader(
        **column,
        page_id=page_id,
        data={ 'value': column.value },
    )
    return col


class ColumnInput(graphene.InputObjectType):
    id = graphene.String()
    name = graphene.String(required=True)
    slug = graphene.String(required=True)
    field = graphene.String(required=True)
    value = graphene.String()
    order = graphene.Int()

class PageInput(graphene.InputObjectType):
    id = graphene.String()
    name = graphene.String(required=True)
    slug = graphene.String(required=True)
    columns = graphene.List(ColumnInput)

class PageType(DjangoObjectType):
    class Meta:
        model = Page


class PageColumnHeaderType(DjangoObjectType):
    data = generic.GenericScalar()

    class Meta:
        model = PageColumnHeader

    value = graphene.String()

    def resolve_value(self, info):
        return self.data['value'] if "value" in self.data else ""


class Query(graphene.ObjectType):
    page = graphene.Field(PageType, site_slug=graphene.String(required=True), page_slug=graphene.String(required=True))

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


class CreatePage(graphene.Mutation):
    page = graphene.Field(PageType)

    class Arguments:
        site_id = graphene.Int(required=True)
        page = PageInput(required=True)

    @login_required
    def mutate(self, info, site_id, page):
        try:
            site = Site.objects.get(id=site_id)
        except Site.DoesNotExist as e:
            raise GraphQLError(e)

        try:
            columns = page.pop("columns", None)
            page = Page(site=site, **page)
            page.save()
            if columns:
                cols = PageColumnHeader.objects.bulk_create([
                    PageColumnHeader(
                        **c,
                        page_id=page.id,
                        data=json.loads(c.data or "{}"),
                    )
                    for c in columns
                ])
                page.columns.set(cols)
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

        existing_columns = [column for column in columns if column.id]
        existing_column_dict = dict()
        for column in PageColumnHeader.objects.filter(id__in=[c.id for c in existing_columns]):
            existing_column_dict[str(column.id)] = column

        for column in existing_columns:
            existing_column = existing_column_dict[column.id]
            existing_column.name = column.get('name', existing_column.name)
            existing_column.slug = column.get('slug', existing_column.slug)
            existing_column.order = column.get('order', existing_column.order)
            existing_column.field = column.get('field', existing_column.field)
            existing_column.data['value'] = column.get('value', '')

        PageColumnHeader.objects.bulk_update(
            existing_column_dict.values(),
            ['name', 'slug', 'order', 'field', 'data']
        )

        new_columns = PageColumnHeader.objects.bulk_create([
            get_page_column_header(column, page.id)
            for column in [c for c in columns if not c.id]
        ])

        return UpdatePage(page=page_obj)


class DeletePage(graphene.Mutation):
    page = graphene.Field(PageType)

    class Arguments:
        site_id = graphene.Int(required=True)
        page_id = graphene.Int(required=True)

    @login_required
    def mutate(self, info, site_id, page_id):
        try:
            page = Page.objects.filter(
                id=page_id,
                site__id=site_id,
                site__owner=info.context.user,
            ).delete()
        except Exception as e:
            raise GraphQLError(e)
        return DeletePage(page=page)


class Mutation(graphene.ObjectType):
    create_page = CreatePage.Field()
    update_page = UpdatePage.Field()
    delete_page = DeletePage.Field()
