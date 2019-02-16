REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'apps.float.renderers.CustomJSONRenderer',
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
    'EXCEPTION_HANDLER': 'apps.float.exception_handler.exception_handler'
}
