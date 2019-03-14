from django.conf import settings
from django.urls import include, path
from .views import ListCreateSites, RetrieveUpdateDestroySite

urlpatterns = [
    path('', ListCreateSites.as_view(), name='sites_list'),
    path('<slug>/', RetrieveUpdateDestroySite.as_view(), name='site_detail'),
    path('<slug>/pages/', include("apps.pages.urls"), name="pages"),
]
