from django.conf import settings
from django.urls import path
from .views import ListCreateSites

urlpatterns = [
    path('', ListCreateSites.as_view(), name='sites_list'),
]
