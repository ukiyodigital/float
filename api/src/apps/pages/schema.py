import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from django.db import IntegrityError
from django.db.models import Q

from apps.pages.models import Page, PageColumnHeader
from apps.sites.models import Site


class PageType(DjangoObjectType):
    class Meta:
        model = Page

class PageColumnHeaderType(DjangoObjectType):
    class Meta:
        model = PageColumnHeader

class Query(graphene.ObjectType):
    page = graphene.Field(PageType, site_slug=graphene.String(required=True), page_slug=graphene.String(required=True))

    def resolve_page(self, info, site_slug, page_slug):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('You must login before accessing this endpoint')
        page = Page.objects.filter(site__slug=site_slug, slug=page_slug).first()
        return page if Page else GraphQLError('No page found with those slugs')

class CreatePage(graphene.Mutation):
    page = graphene.Field(PageType)

    class Arguments:
        site_id = graphene.Int(required=True)
        name = graphene.String(required=True)
        slug = graphene.String(required=True)

    def mutate(self, info, site_id, name, slug):
        user = info.context.user or None

        if user.is_anonymous:
            raise GraphQLError('You must login before accessing this endpoint')

        site = Site.objects.filter(id=site_id).first()
        if not site:
            raise GraphQLError('Site does not exist')

        try:
            page = Page(name=name, slug=slug, site=site)
            page.save()
        except IntegrityError as e:
            raise GraphQLError('Could not save with given slug and owner')
        return CreatePage(page=page)

class Mutation(graphene.ObjectType):
    create_page = CreatePage.Field()
