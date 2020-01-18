import graphene
from graphene.types import generic

from graphene_django import DjangoObjectType
from graphql import GraphQLError

from django.db import IntegrityError
from django.db.models import Q

import json

from apps.float.utils import check_authentication

from apps.flocks.models import Flock, FlockColumnHeader
from apps.sites.models import Site


class FlockInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    slug = graphene.String(required=True)


class ColumnInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    slug = graphene.String(required=True)
    field = graphene.String(required=True)
    order = graphene.Int()


class FlockType(DjangoObjectType):
    class Meta:
        model = Flock


class FlockColumnHeaderType(DjangoObjectType):
    class Meta:
        model = FlockColumnHeader


class Query(graphene.ObjectType):
    flock = graphene.Field(FlockType, site_slug=graphene.String(required=True), flock_slug=graphene.String(required=True))

    def resolve_flock(self, info, site_slug, flock_slug):
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
            print(flock)
            flock_obj =  Flock.objects.create(site=site, **flock)
        except IntegrityError as e:
            raise GraphQLError(e)


        return CreateFlock(flock=flock_obj)


# TODO, play around with data field since it's an array of JSON instead of just JSON
class UpdateFlock(graphene.Mutation):
    flock = graphene.Field(FlockType)

    class Arguments:
        site_id = graphene.Int(required=True)
        flock_id = graphene.Int(required=True)
        flock_data = FlockInput(required=True)
        # array of JSON data
        data = graphene.String()

    def mutate(self, info, site_id, flock_id, flock_data, data):
        check_authentication(info.context.user)

        try:
            flock_obj = Flock.objects.get(site__id=site_id, id=flock_id)
        except Flock.DoesNotExist as e:
            raise GraphQLError(e)

        try:
            flock_data['data'] = json.loads(data)
            flock_obj.name = flock_data.get('name', flock_obj.name)
            flock_obj.slug = flock_data.get('slug', flock_obj.slug)
            print(data)
            # flock_obj.data = data.get('data', flock_obj.data)
            flock_obj.save()
        except IntegrityError as e:
            raise GraphQLError(e)

        return UpdateFlock(flock=flock_obj)


# class DeleteFlock(graphene.Mutation):
#     pass


# class AddFlockItem(graphene.Mutation):
#     pass


# class UpdateFlockItem(graphene.Mutation):
#     pass


# class RemoveFlockItem(graphene.Mutation):
#     pass


class Mutation(graphene.ObjectType):
    create_flock = CreateFlock.Field()
    update_flock = UpdateFlock.Field()
