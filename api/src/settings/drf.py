REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'apps.float.renderers.CustomJSONRenderer',
        'rest_framework.renderers.JSONRenderer',
    ),
    # 'DEFAULT_PERMISSION_CLASSES': (
    #     'rest_framework.permissions.IsAuthenticated',
    # ),
    'EXCEPTION_HANDLER': 'apps.float.exception_handler.exception_handler'
}
