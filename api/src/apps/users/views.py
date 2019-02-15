from django.core.exceptions import PermissionDenied, ValidationError
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.debug import sensitive_post_parameters
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny

from apps.users.serializers import UserSerializer
from apps.users.models import User

import json


class UserAuth(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request):
        """
        returns user detail for current logged in user
        """
        if request.user.is_authenticated:
            user = get_object_or_404(User, username=request.user.username)

            serialized_data = UserSerializer(user).data
            return Response(serialized_data)

        self.kwargs['errors'] = [{
            "title": "Authorization Error",
            "detail": "User is not authenticated."
        }]
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        username = request.session.get("username", None)
        password = request.session.get("password", None)
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)

        serialized_data = UserSerializer(user).data
        return Response(serialized_data)

    @method_decorator(ensure_csrf_cookie)
    def delete(self, request):
        """
        log out
        """
        logout(request)
        return Response(True)

    @method_decorator(sensitive_post_parameters("password"))
    def dispatch(self, request, *args, **kwargs):
        """
        Overriding the dispatch method because we want to mark password as sensitive
        """
        return super(UserAuth, self).dispatch(request, *args, **kwargs)

class UserSignUp(APIView):
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        print(data["username"], data["email"], data["password"])
        # TODO user serializer to handle errors if user already exists, username taken, etc.
        user = User.objects.create_user(
            email=data["email"],
            password=data["password"],
            username=data["username"]
        )

        serialized_data = UserSerializer(user).data
        return Response(serialized_data)
