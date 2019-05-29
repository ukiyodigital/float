from django.urls import include, path
from django.conf import settings
from graphene_django.views import GraphQLView


urlpatterns = [
    path('graphql/', GraphQLView.as_view(graphiql=True))
    # path('api/v1.0/users/', include("apps.users.urls"), name="users"),
    # path('api/v1.0/sites/', include("apps.sites.urls"), name="sites"),
]

if "silk" in settings.INSTALLED_APPS:
    urlpatterns += [path('silk/', include('silk.urls'), name="silk")]
