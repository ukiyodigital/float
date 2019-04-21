from django.conf import settings
from django.urls import path
from apps.pages.views import ListCreatePage, RetrieveUpdateDestroyPage, CreatePageColumn

app_name = 'pages'

urlpatterns = [
    path('', ListCreatePage.as_view(), name='list_create_page'),
    path('<page_slug>/', RetrieveUpdateDestroyPage.as_view(), name='retrieve_update_destroy_page'),
    path('<page_slug>/column/', CreatePageColumn.as_view(), name='create_page_column'),
]
