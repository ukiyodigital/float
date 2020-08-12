from django.urls import include, path
from django.conf import settings
from graphene_file_upload.django import FileUploadGraphQLView


urlpatterns = [
    path('graphql/', FileUploadGraphQLView.as_view(graphiql=True))
]

if "silk" in settings.INSTALLED_APPS:
    urlpatterns += [path('silk/', include('silk.urls'), name="silk")]
