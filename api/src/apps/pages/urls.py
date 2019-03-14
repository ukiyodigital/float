from django.conf import settings
from django.urls import path
from apps.pages.views import CreatePage

urlpatterns = [
    path('', CreatePage.as_view(), name='create_page')
]
