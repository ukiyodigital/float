import os


SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DEBUG = os.environ["DJANGO_DEBUG"]
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
    'rest_framework',
    'django_extensions',
    'corsheaders',
]

FLOAT_APPS = [
    'apps.users',
]

INSTALLED_APPS = VENDOR_APPS + FLOAT_APPS

if os.environ["APP_ENV"] == 'development':
    INSTALLED_APPS += [
        'rest_framework_swagger',
        'silk',
        'django_nose',
    ]


# middlewares
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    # 'apps.float.middleware.CsrfHeaderMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
]

if os.environ["APP_ENV"] == "development":
    MIDDLEWARE = [
        'silk.middleware.SilkyMiddleware',
    ] + MIDDLEWARE


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
STATIC_URL = '/api/static/'
STATIC_ROOT = os.path.join(BASE_DIR, "static")


# session time out rules
SESSION_COOKIE_AGE = 7200  # 2 Hours
SESSION_SAVE_EVERY_REQUEST = True  # updates the cookie age on every request
SESSION_EXPIRE_AT_BROWSER_CLOSE = False  # must be set to false for the cookie age to take effect

# secure our app and sessions
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_SECURE = True

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = False
SECURE_HSTS_SECONDS = 604800
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')


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
        'NAME': os.environ["DJANGO_DB_NAME"],
        'USER': os.environ["DJANGO_DB_USER"],
        'PASSWORD': os.environ["DJANGO_DB_PASSWORD"],
        'HOST': os.environ["DJANGO_DB_HOST"],
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
