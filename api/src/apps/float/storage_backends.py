from storages.backends.s3boto3 import S3Boto3Storage
from settings import settings


class MediaStorage(S3Boto3Storage):
    location = settings.AWS_MEDIA_LOCATION
    default_acl = 'private'
    file_overwrite = False
