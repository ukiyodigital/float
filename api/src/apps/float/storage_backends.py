from storages.backends.s3boto3 import S3Boto3Storage
from settings import settings


class MediaStorage(S3Boto3Storage):
    location = settings.AWS_MEDIA_LOCATION if settings.AWS_MEDIA_LOCATION else 'media'
    default_acl = 'private'
    file_overwrite = False
    custom_domain = False
