import graphene
from graphene.types import generic

from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
from graphql import GraphQLError

from django.db import IntegrityError
from django.db.models import Q

import json

from apps.flocks.models import Flock, FlockColumnHeader
from apps.sites.models import Site
from apps.uploads.models import FileUpload

# this should be moved outside of the schema file at some point
def loop_thru_dict(data, flock_id=None, parent_id=None):
    for key in data.keys():
        if isinstance(data[key], dict):
            column = FlockColumnHeader.objects.get(flock_id=flock_id, parent_id=parent_id, slug=key)
            if (column.field == 'IMAGE'):
                image = FileUpload.objects.get(id=data[key].get('id'))
                data[key]['url'] = image.file.url
            if (column.field == 'OBJECT'):
                loop_thru_dict(data[key], None, column.id)
    return data


def loop_thru_items(items, flock_id=None, parent_id=None):
    data = []
    for item in items:
        data.append(loop_thru_dict(item, flock_id, parent_id))

    return data

class FlockColumnInput(graphene.InputObjectType):
    id = graphene.String()
    name = graphene.String(required=True)
    slug = graphene.String(required=True)
    field = graphene.String(required=True)
    columns = graphene.List(lambda: FlockColumnInput)

    # meta
    order = graphene.Int()
    flock_id = graphene.Int(name='flock_id')
    parent_id = graphene.Int(name='parent_id')

class FlockInput(graphene.InputObjectType):
    id = graphene.String()
    name = graphene.String(required=True)
    slug = graphene.String(required=True)
    data = graphene.List(generic.GenericScalar)
    columns = graphene.List(FlockColumnInput)


class FlockType(DjangoObjectType):
    data = graphene.List(generic.GenericScalar)

    class Meta:
        model = Flock

    def resolve_data(self, info):
        return loop_thru_items(self.data or [], self.id)


class FlockColumnHeaderType(DjangoObjectType):
    class Meta:
        model = FlockColumnHeader

class FlockItemType(graphene.ObjectType):
    item = generic.GenericScalar()

class Query(graphene.ObjectType):
    flock = graphene.Field(
        FlockType,
        site_slug=graphene.String(required=True),
        flock_slug=graphene.String(required=True),
    )
    flock_by_key = graphene.Field(
        FlockType,
        api_key=graphene.String(required=True),
        flock_slug=graphene.String(required=True),
    )
    item_by_key_and_subset = graphene.Field(
        FlockItemType,
        api_key=graphene.String(required=True),
        flock_slug=graphene.String(required=True),
        subset=generic.GenericScalar(required=True),
    )

    @login_required
    def resolve_flock(self, info, site_slug, flock_slug):
        try:
            flock = Flock.objects.get(
                site__slug=site_slug,
                slug=flock_slug,
                site__owner=info.context.user,
            )
        except Flock.DoesNotExist as e:
            raise GraphQLError(e)

        return flock

    def resolve_flock_by_key(self, info, api_key, flock_slug):
        try:
            flock = Flock.objects.get(
                site__api_key__key=api_key,
                slug=flock_slug,
            )
        except Flock.DoesNotExist as e:
            raise GraphQLError(e)
        return flock

    def resolve_item_by_key_and_subset(self, info, api_key, flock_slug, subset):
        try:
            flock = Flock.objects.get(
                site__api_key__key=api_key,
                slug=flock_slug,
            )
        except Flock.DoesNotExist as e:
            raise GraphQLError(e)
        for flock_item in flock.data:
            if all(item in flock_item.items() for item in subset.items()):
                return FlockItemType(
                    item=flock_item,
                )
        raise GraphQLError('Item with subset does not exist')


class CreateFlock(graphene.Mutation):
    flock = graphene.Field(FlockType)

    class Arguments:
        site_id = graphene.Int(required=True)
        flock = FlockInput(required=True)

    @login_required
    def mutate(self, info, site_id, flock):
        try:
            flock_obj = Flock.objects.create(site_id=site_id, **flock)
        except IntegrityError as e:
            raise GraphQLError(e)


        return CreateFlock(flock=flock_obj)


class UpdateFlock(graphene.Mutation):
    flock = graphene.Field(FlockType)

    class Arguments:
        site_id = graphene.Int(required=True)
        flock = FlockInput(required=True)

    @login_required
    def mutate(self, info, site_id, flock):
        try:
            flock_obj = Flock.objects.get(site__id=site_id, id=flock.id)
        except Flock.DoesNotExist as e:
            raise GraphQLError(e)

        try:
            flock_obj.name = flock.get('name', flock_obj.name)
            flock_obj.slug = flock.get('slug', flock_obj.slug)
            flock_obj.data = flock.get('data', flock_obj.data)

            columns = flock.get("columns", [])
            flock_obj.columns.exclude(id__in=[c.id for c in columns if c.id]).delete()

            flock_obj.update_columns(columns)

            flock_obj.save()
        except IntegrityError as e:
            raise GraphQLError('Duplicate slugs found in same flock or same column')

        return UpdateFlock(flock=flock_obj)


class Mutation(graphene.ObjectType):
    create_flock = CreateFlock.Field()
    update_flock = UpdateFlock.Field()
