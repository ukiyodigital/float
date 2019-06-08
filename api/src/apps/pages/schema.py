import graphene
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

class PageType(DjangoObjectType):
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
            page = Page(name=name, slug=slug, site=site)
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

class Mutation(graphene.ObjectType):
    create_page = CreatePage.Field()
    update_page = UpdatePage.Field()
