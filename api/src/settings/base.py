import os

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "")

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DEBUG = os.environ["DJANGO_DEBUG"] == "True"
ALLOWED_HOSTS = os.environ["DJANGO_ALLOWED_HOSTS"].split(",")

ROOT_URLCONF = 'urls'
WSGI_APPLICATION = 'wsgi.application'


# Application definition
VENDOR_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # plugins
    'graphene_django',
    'django_extensions',
    'corsheaders',
    'storages',
]

FLOAT_APPS = [
    'apps.float',
    'apps.column_headers',
    'apps.users',
    'apps.sites',
    'apps.pages',
    'apps.flocks',
]

INSTALLED_APPS = VENDOR_APPS + FLOAT_APPS

if os.environ["APP_ENV"] == 'development':
    INSTALLED_APPS += [
        'silk',
        'django_nose',
    ]

GRAPHENE = {
    'SCHEMA': 'apps.float.schema.schema',
    'MIDDLEWARE': [
        'graphql_jwt.middleware.JSONWebTokenMiddleware',
    ],
}

# middlewares
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
]

if os.environ["APP_ENV"] == "development":
    MIDDLEWARE = [
        'silk.middleware.SilkyMiddleware',
    ] + MIDDLEWARE

AUTHENTICATION_BACKENDS = [
    'graphql_jwt.backends.JSONWebTokenBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "static"), os.path.join(BASE_DIR, "templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# custom user model
AUTH_USER_MODEL = 'users.User'


# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'America/Los_Angeles'
USE_I18N = False
USE_L10N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, "static")




# cache
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        "TIMEOUT": 60 * 60 * 25  # 25 hours
    },
}


# Database
DATABASES = {
    "default": {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get("DJANGO_DB_NAME", ""),
        'USER': os.environ.get("DJANGO_DB_USER", ""),
        'PASSWORD': os.environ.get("DJANGO_DB_PASSWORD", ""),
        'HOST': os.environ.get("DJANGO_DB_HOST", ""),
        'PORT': 5432,
        'ATOMIC_REQUESTS': True,
    }
}


# Email config
EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'


# testing
if "django_nose" in INSTALLED_APPS:
    TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'
    NOSE_ARGS = [
        '--nocapture',
        '--nologcapture',
        '--with-coverage',
        '--cover-package={}'.format(",".join(FLOAT_APPS))
    ]
