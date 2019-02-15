from django.conf import settings
from django.urls import include, path
from .views import UserAuth, UserSignUp

urlpatterns = [
    path('auth/', UserAuth.as_view(), name="auth"),
    path('signup/', UserSignUp.as_view(), name="signup")
]
