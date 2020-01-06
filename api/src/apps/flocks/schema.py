from django.db import IntegrityError
from django.db.models import Q

import json

from apps.float.utils import check_authentication

from apps.flocks.models import Flock, FlockColumnHeader
from apps.sites.models import Site


class FlockInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    slug = graphene.String(required=True)

    # JSON array of data
    data = graphene.String()


class ColumnInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    slug = graphene.String(required=True)
    field = graphene.String(required=True)
    order = graphene.Int()


class FlockType(DjangoObjectTypoe):
    data = generic.GenericScalar()

    class Meta:
        model = Flock


class FlockColumnHeaderType(DjangoObjectType):
    class Meta:
        model = FlockColumnHeader


class Query(graphene.ObjectType):
    flock = graphene.Field(FlockType, site_slug=graphene.String(required=True), flock_slug=graphene.String(required=True))

    def resolve_page(self, info, site_slug, page_slug):
        check_authentication(info.context.user)

        # maybe switch to try catch statement instead
        flock = Flock.objects.filter(site__slug=site_slug, slug=flock_slug).first()
        return flock if flock else GraphQLError('No flock found with those slugs')


class CreateFlock(graphene.Mutation):
    flock = graphene.Field(FlockType)

    class Arguments:
        site_id = graphene.Int(required=True)
        flock = FlockInput(required=True)

    def mutate(self, info, site_id, flock):
        check_authentication(info.context.user)

        site = Site.objects.filter(id=site_id).first()
        if not site:
            raise GraphQLError('Site does not exist')

        try:
            flock['data'] = json.loads(flock['data'])
            f =  Flock(site=site, **flock)
            f.save()
        except IntegrityError as e:
            raise GraphQLError('Could not save with given slug and owner')

        return CreateFlock(flock=flock)
