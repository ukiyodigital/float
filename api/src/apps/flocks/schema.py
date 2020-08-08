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


class FlockColumnInput(graphene.InputObjectType):
    id = graphene.String()
    name = graphene.String(required=True)
    slug = graphene.String(required=True)
    field = graphene.String(required=True)
    order = graphene.Int()


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


class FlockColumnHeaderType(DjangoObjectType):
    class Meta:
        model = FlockColumnHeader


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

            existing_columns = [column for column in columns if column.id]
            existing_column_dict = dict()
            for column in FlockColumnHeader.objects.filter(id__in=[c.id for c in existing_columns]):
                existing_column_dict[str(column.id)] = column

            for column in existing_columns:
                existing_column = existing_column_dict[column.id]
                existing_column.name = column.get('name', existing_column.name)
                existing_column.slug = column.get('slug', existing_column.slug)
                existing_column.order = column.get('order', existing_column.order)
                existing_column.field = column.get('field', existing_column.field)

            FlockColumnHeader.objects.bulk_update(
                existing_column_dict.values(),
                ['name', 'slug', 'order', 'field']
            )

            new_columns = FlockColumnHeader.objects.bulk_create([
                FlockColumnHeader(
                    **column,
                    flock_id=flock.id,
                )
                for column in [c for c in columns if not c.id]
            ])
            flock_obj.save()
        except IntegrityError as e:
            raise GraphQLError(e)

        return UpdateFlock(flock=flock_obj)


class Mutation(graphene.ObjectType):
    create_flock = CreateFlock.Field()
    update_flock = UpdateFlock.Field()
