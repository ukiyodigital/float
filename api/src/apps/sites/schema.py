import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q

from apps.float.utils import check_authentication

from apps.sites.models import Site, SiteAPIKey


class SiteInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    slug = graphene.String(required=True)

class SiteType(DjangoObjectType):
    class Meta:
        model = Site

class SiteAPIKeyType(DjangoObjectType):
    class Meta:
        model = SiteAPIKey

class Query(graphene.ObjectType):
    sites = graphene.List(SiteType)
    site = graphene.Field(SiteType, slug=graphene.String(required=True))

    def resolve_sites(self, info):
        user = check_authentication(info.context.user)

        return Site.objects.filter(owner=user)

    def resolve_site(self, info, slug):
        user = check_authentication(info.context.user)
        site = Site.objects.filter(owner=user, slug=slug).first()

        return site if site else GraphQLError('No site found with that slug')


class CreateSite(graphene.Mutation):
    site = graphene.Field(SiteType)

    class Arguments:
        site = SiteInput(required=True)

    def mutate(self, info, site):
        user = check_authentication(info.context.user)

        site = Site.create(owner=user, **site)
        site.owner = user
        site.save()
        return CreateSite(site=site)

class Mutation(graphene.ObjectType):
    create_site = CreateSite.Field()
