from django.urls import include, path
from django.conf import settings


urlpatterns = [
    path('api/v1.0/users/', include("apps.users.urls"), name="users"),
]

if "silk" in settings.INSTALLED_APPS:
    urlpatterns += [path('silk/', include('silk.urls'), name="silk")]

if "rest_framework_swagger" in settings.INSTALLED_APPS:
    from rest_framework_swagger.views import get_swagger_view
    urlpatterns += [path('api-docs/', get_swagger_view(title='Float API'))]
