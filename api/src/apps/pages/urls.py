from django.conf import settings
from django.urls import path
from apps.pages.views import ListCreatePage, RetrieveUpdateDestroyPage

app_name = 'pages'

urlpatterns = [
    path('', ListCreatePage.as_view(), name='list_create_page'),
    path('<slug>/', RetrieveUpdateDestroyPage.as_view(), name='retrieve_update_destroy_page'),
    # '/<slug>/, RUDView
]
