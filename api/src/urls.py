from django.urls import include, path
from django.conf import settings
from graphene_django.views import GraphQLView


urlpatterns = [
    path('api/graphql/', GraphQLView.as_view(graphiql=True))
]

if "silk" in settings.INSTALLED_APPS:
    urlpatterns += [path('api/silk/', include('silk.urls'), name="silk")]
