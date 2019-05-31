import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q

from apps.pages.models import Page, PageColumnHeader


class PageType(DjangoObjectType):
    class Meta:
        model = Page

class PageColumnHeaderType(DjangoObjectType):
    class Meta:
        model = PageColumnHeader

class Query(graphene.ObjectType):
    pages = graphene.List(PageType, site=graphene.String(required=True))

    def resolve_pages(self, info, site):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('You must login before accessing this endpoint')
        return Page.objects.filter(site=site)
