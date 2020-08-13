import os
import graphene
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload

from graphql import GraphQLError
from graphql_jwt.decorators import login_required

from django.db import IntegrityError
from django.db.models import Q

from apps.uploads.models import FileUpload
from settings import settings


class FileUploadType(DjangoObjectType):
    class Meta:
        model = FileUpload

class FileUploadInput(graphene.InputObjectType):
    file = graphene.String(required=True)
    site_id = graphene.String(required=True)


class Query(graphene.ObjectType):
    uploads = graphene.List(FileUploadType)
    upload = graphene.Field(FileUploadType)

    @login_required
    def resolve_uploads(self, info, site_id):
        return FileUpload.objects.filter(site__id=site_id, site__owner=info.context.user)

    @login_required
    def resolve_upload(self, info, upload_id):
        try:
            upload = FileUpload.objects.get(
                id=upload_id,
                site__owner=info.context.user,
            )
        except FileUpload.DoesNotExist as e:
            raise GraphQLError(e)
        return upload


class UploadFile(graphene.Mutation):
    success = graphene.Boolean()
    file = graphene.Field(FileUploadType)
    url = graphene.String()

    class Arguments:
        file_upload = Upload(required=True)
        site_id = graphene.Int(required=True)

    @login_required
    def mutate(self, info, file_upload, site_id):
        if settings.USE_S3:
            upload = FileUpload(
                file=file_upload,
                site_id=site_id,
            )
            upload.save()

            return UploadFile(file=upload, url=upload.file.url)

        raise GraphQLError('file upload not supported')

class Mutation(graphene.ObjectType):
    upload_file = UploadFile.Field()
