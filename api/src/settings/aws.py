import os
import json
import boto3

USE_AWS = os.environ.get("USE_AWS") == "True"
USE_AWS = os.environ.get("USE_AWS") == "True"
USE_ACCESS_KEYS = os.environ.get("USE_ACCESS_KEYS") == "True"
SECRET_PATH = '/Float/API/'
AWS_DEFAULT_ACL = None

if USE_AWS:
        # SSM setup
    ssm = boto3.client(
        'ssm',
        region_name='us-west-2',
        aws_access_key_id=os.environ["SSM_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["SSM_SECRET_ACCESS_KEY"],
    ) if USE_ACCESS_KEYS else boto3.client('ssm', region_name='us-west-2')

    # S3 setup
    s3 = boto3.resource('s3',
        region_name='us-west-2',
        aws_access_key_id=os.environ["S3_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["S3_ACCESS_KEY_ID"],
    ) if USE_ACCESS_KEYS else boto3.resource('s3', region_name='us-west-2')

    # private functions
    def _get_ssm_key(name):
        key = ssm.get_parameter(Name=f'{SECRET_PATH}{name}', WithDecryption=True)
        try:
            return json.loads(key['Parameter']['Value'])
        except ValueError:
            # Assume value is a simple string
            return key['Parameter']['Value']

    # S3 Config
    AWS_S3_CUSTOM_DOMAIN = f'{os.environ["AWS_BUCKET_NAME"]}.s3.amazonaws.com'
    AWS_S3_OBJECT_PARAMETERS = {
        'CacheControl': 'max-age=86400',
    }
    AWS_LOCATION = 'static'

    AWS_PUBLIC_MEDIA_LOCATION = 'media/public'
    DEFAULT_FILE_STORAGE = 'float.storage_backends.PublicMediaStorage'

    AWS_PRIVATE_MEDIA_LOCATION = 'media/private'
    PRIVATE_FILE_STORAGE = 'float.storage_backends.PrivateMediaStorage'

    # SSM replacements
    SECRET_KEY = _get_ssm_key('DJANGO_SECRET_KEY')

    # Database
    DATABASES = {
        "default": {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': _get_ssm_key('DJANGO_DB_NAME'),
            'USER': _get_ssm_key('DJANGO_DB_USER'),
            'PASSWORD': _get_ssm_key('DJANGO_DB_PASSWORD'),
            'HOST': _get_ssm_key('DJANGO_DB_HOST'),
            'PORT': 5432,
            'ATOMIC_REQUESTS': True,
        }
    }
