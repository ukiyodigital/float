from django.conf import settings
from django.urls import include, path
from .views import UserAuth

urlpatterns = [
    path('auth/', UserAuth.as_view(), name="auth")
]
