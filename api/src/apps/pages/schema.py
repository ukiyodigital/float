import graphene
from graphene.types import generic

from graphene_django import DjangoObjectType
from graphql import GraphQLError

from django.db import IntegrityError
from django.db.models import Q

from apps.float.utils import check_authentication

from apps.pages.models import Page, PageColumnHeader
from apps.sites.models import Site

class PageInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    slug = graphene.String(required=True)

class ColumnInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    slug = graphene.String(required=True)
    field = graphene.String(required=True)
    data = graphene.String(required=True)
    order = graphene.Int()

class PageType(DjangoObjectType):
    data = generic.GenericScalar()

    class Meta:
        model = Page

class PageColumnHeaderType(DjangoObjectType):
    class Meta:
        model = PageColumnHeader

class Query(graphene.ObjectType):
    page = graphene.Field(PageType, site_slug=graphene.String(required=True), page_slug=graphene.String(required=True))

    def resolve_page(self, info, site_slug, page_slug):
        check_authentication(info.context.user)
        page = Page.objects.filter(site__slug=site_slug, slug=page_slug).first()
        return page if Page else GraphQLError('No page found with those slugs')

class CreatePage(graphene.Mutation):
    page = graphene.Field(PageType)

    class Arguments:
        site_id = graphene.Int(required=True)
        page = PageInput(required=True)

    def mutate(self, info, site_id, page):
        check_authentication(info.context.user)

        site = Site.objects.filter(id=site_id).first()
        if not site:
            raise GraphQLError('Site does not exist')

        try:
            page = Page(site=site, **page)
            page.save()
        except IntegrityError as e:
            raise GraphQLError('Could not save with given slug and owner')

        return CreatePage(page=page)

class UpdatePage(graphene.Mutation):
    page = graphene.Field(PageType)

    class Arguments:
        site_id = graphene.Int(required=True)
        page_id = graphene.Int()
        page = PageInput(required=True)

    def mutate(self, info, site_id, page_id, page):
        check_authentication(info.context.user)

        page_obj = Page.objects.filter(id=page_id, site__id=site_id).first()
        if not page_obj:
            raise GraphQLError('Page does not exist')

        page_obj.name = page.name
        page_obj.slug = page.slug

        return UpdatePage(page=page_obj)

class DeletePage(graphene.Mutation):
    page = graphene.Field(PageType)

    class Arguments:
        site_id = graphene.Int(required=True)
        page_id = graphene.Int()

    def mutate(self, info, site_id, page_id, page):
        check_authentication(info.context.user)

        page_obj = Page.objects.filter(id=page_id, site__id=site_id).delete()

        return DeletePage(page=page_obj)

class AddPageColumn(graphene.Mutation):
    """
    Add a column, return the rest of the columns on the page
    """
    columns = graphene.List(PageColumnHeaderType)

    class Arguments:
        site_id = graphene.Int(required=True)
        page_id = graphene.Int(required=True)
        column = ColumnInput(required=True)

    def mutate(self, info, site_id, page_id, column):
        check_authentication(info.context.user)

        page = Page.objects.filter(id=page_id, site__id=site_id).delete()
        column_obj = page.columns.create(**column)

        return AddColumn(columns=page.columns.all())

# class UpdateColumn(graphene.Mutation):
#     pass

# class DeleteColumn(graphene.Mutation):
#     pass

class Mutation(graphene.ObjectType):
    create_page = CreatePage.Field()
    update_page = UpdatePage.Field()
    delete_page = DeletePage.Field()
    add_page_column = AddPageColumn.Field()
