import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q

from apps.sites.models import Site, SiteAPIKey


class SiteType(DjangoObjectType):
    class Meta:
        model = Site

class SiteAPIKeyType(DjangoObjectType):
    class Meta:
        model = SiteAPIKey

class Query(graphene.ObjectType):
    sites = graphene.List(SiteType)

    def resolve_sites(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('You must login before accessing this endpoint')
        return Site.objects.filter(owner=user)


class CreateSite(graphene.Mutation):
    site = graphene.Field(SiteType)

    class Arguments:
        name = graphene.String(required=True)
        slug = graphene.String(required=True)

    def mutate(self, info, **kwargs):
        user = info.context.user or None

        if user.is_anonymous:
            raise GraphQLError('You must login before accessing this endpoint')

        site = Site.create(owner=user, **kwargs)
        site.owner = user
        site.save()
        return CreateSite(site=site)

class Mutation(graphene.ObjectType):
    create_site = CreateSite.Field()
