import graphene
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload

from graphql import GraphQLError
from graphql_jwt.decorators import login_required

from django.db import IntegrityError
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
    site = graphene.Field(
        SiteType,
        slug=graphene.String(required=True),
    )
    site_by_key = graphene.Field(
        SiteType,
        api_key=graphene.String(required=True),
    )

    @login_required
    def resolve_sites(self, info):
        return Site.objects.filter(owner=info.context.user)

    @login_required
    def resolve_site(self, info, slug):
        try:
            site = Site.objects.get(
                slug=slug,
                owner=info.context.user,
            )
        except Site.DoesNotExist as e:
            raise GraphQLError(e)
        return site

    def resolve_site_by_key(self, info, api_key):
        try:
            site = Site.objects.get(
                api_key__key=api_key
            )
        except Site.DoesNotExist as e:
            raise GraphQLError(e)
        return site


class CreateSite(graphene.Mutation):
    site = graphene.Field(SiteType)

    class Arguments:
        site = SiteInput(required=True)

    @login_required
    def mutate(self, info, site):
        try:
            site = Site.create(owner=info.context.user, **site)
        except IntegrityError as e:
            raise GraphQLError(e)

        return CreateSite(site=site)

class UpdateSite(graphene.Mutation):
    site = graphene.Field(SiteType)

    class Arguments:
        site_id = graphene.Int(required=True)
        site = SiteInput(required=True)

    @login_required
    def mutate(self, info, site_id, site):
        try:
            site_obj = Site.objects.get(
                id=site_id,
                owner=info.context.user
            )
        except Site.DoesNotExist as e:
            raise GraphQLError(e)

        site_obj.name = site.name
        site_obj.slug = site.slug

        return UpdateSite(site=site_obj)


class DeleteSite(graphene.Mutation):
    site = graphene.Field(SiteType)

    class Arguments:
        site_id = graphene.Int(required=True)

    @login_required
    def mutate(self, info, site_id):
        site_obj = Site.objects.filter(
            id=site_id,
            owner=info.context.user,
        ).delete()

        return DeleteSite(site=site_obj)

class UploadFile(graphene.Mutation):
    class Arguments:
        f = Upload(required=True)

    success = graphene.Boolean()

    @login_required
    def mutate(self, info, f):
        print(f)
        # do something with your file

        return UploadFile(success=True)

class Mutation(graphene.ObjectType):
    upload_file = UploadFile.Field()
    create_site = CreateSite.Field()
    update_site = UpdateSite.Field()
    delete_site = DeleteSite.Field()
