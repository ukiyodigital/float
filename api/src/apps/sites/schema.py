import graphene
from graphene_django import DjangoObjectType

from graphql import GraphQLError
from graphql_jwt.decorators import login_required

from django.db.models import Q

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

    @login_required
    def resolve_sites(self, info):
        return Site.objects.filter(owner=info.context.user)

    @login_required
    def resolve_site(self, info, slug):
        site = Site.objects.filter(owner=info.context.user, slug=slug).first()

        return site if site else GraphQLError('No site found with that slug')


class CreateSite(graphene.Mutation):
    site = graphene.Field(SiteType)

    class Arguments:
        site = SiteInput(required=True)

    @login_required
    def mutate(self, info, site):
        site = Site.create(owner=info.context.user, **site)
        site.save()
        return CreateSite(site=site)

class UpdateSite(graphene.Mutation):
    site = graphene.Field(SiteType)

    class Arguments:
        site_id = graphene.Int(required=True)
        site = SiteInput(required=True)

    @login_required
    def mutate(self, info, site_id, site):
        site_obj = Site.objects.filter(id=site_id).first()
        if not site_obj:
            raise GraphQLError('Site does not exist')

        site_obj.name = site.name
        site_obj.slug = site.slug

        return UpdateSite(site=site_obj)


class DeleteSite(graphene.Mutation):
    site = graphene.Field(SiteType)

    class Arguments:
        site_id = graphene.Int(required=True)

    @login_required
    def mutate(self, info, site_id):
        site_obj = Site.objects.filter(id=site_id).delete()

        return DeleteSite(site=site_obj)

class Mutation(graphene.ObjectType):
    create_site = CreateSite.Field()
    update_site = UpdateSite.Field()
    delete_site = DeleteSite.Field()
