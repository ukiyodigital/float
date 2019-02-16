from django.conf import settings
from django.urls import include, path
from .views import UserSignup, UserLogin

urlpatterns = [
    path('login/', UserLogin.as_view(), name='login'),
    path('signup/', UserSignup.as_view(), name='signup')
]
