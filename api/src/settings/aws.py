import os
import json
import boto3

USE_SSM = os.environ.get('USE_SSM') == 'True'
USE_S3 = os.environ.get('USE_S3') == 'True'
USE_ACCESS_KEYS = os.environ.get('USE_ACCESS_KEYS') == 'True'

IS_LOCALSTACK = os.environ.get('IS_LOCALSTACK') == 'True'

if USE_SSM:
    # SSM setup
    ssm = boto3.client(
        'ssm',
        region_name='us-west-2',
        aws_access_key_id=os.environ['SSM_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['SSM_SECRET_ACCESS_KEY'],
    ) if USE_ACCESS_KEYS else boto3.client('ssm', region_name='us-west-2')

    SECRET_PATH = '/Float/API/'
    # private functions
    def _get_ssm_key(name):
        key = ssm.get_parameter(Name=f'{SECRET_PATH}{name}', WithDecryption=True)
        try:
            return json.loads(key['Parameter']['Value'])
        except ValueError:
            # Assume value is a simple string
            return key['Parameter']['Value']

    # SSM replacements
    SECRET_KEY = _get_ssm_key('DJANGO_SECRET_KEY')

    # Database
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': _get_ssm_key('DJANGO_DB_NAME'),
            'USER': _get_ssm_key('DJANGO_DB_USER'),
            'PASSWORD': _get_ssm_key('DJANGO_DB_PASSWORD'),
            'HOST': _get_ssm_key('DJANGO_DB_HOST'),
            'PORT': 5432,
            'ATOMIC_REQUESTS': True,
        }
    }

if USE_S3:
    if USE_ACCESS_KEYS:
        AWS_ACCESS_KEY_ID = os.environ['S3_ACCESS_KEY_ID']
        AWS_SECRET_ACCESS_KEY = os.environ['S3_SECRET_ACCESS_KEY']

    # S3 Config
    AWS_STORAGE_BUCKET_NAME = os.environ['AWS_BUCKET_NAME']
    AWS_MEDIA_LOCATION = 'media'

    if IS_LOCALSTACK:
        AWS_S3_ENDPOINT_URL = os.environ.get('AWS_S3_ENDPOINT_URL')
        MEDIA_URL = f'{AWS_S3_ENDPOINT_URL}/{AWS_STORAGE_BUCKET_NAME}/{AWS_MEDIA_LOCATION}/'
    else:
        AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
        MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{AWS_MEDIA_LOCATION}/'

    AWS_S3_OBJECT_PARAMETERS = {
        'CacheControl': 'max-age=86400',
    }
    DEFAULT_FILE_STORAGE = 'float.storage_backends.MediaStorage'
