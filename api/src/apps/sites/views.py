from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from apps.sites.serializers import SiteCreateSerializer, SiteListSerializer, SiteDetailSerializer
from apps.sites.models import Site
from rest_framework.response import Response


class ListCreateSites(ListCreateAPIView):
    """
    Endpoint for creating new sites, and also listing out current ones accessible by the user
    """
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Site.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "POST":
            return SiteCreateSerializer
        return SiteListSerializer

    def post(self, request, *args, **kwargs):
        super().post(request, *args, **kwargs)
        site = Site.objects.filter(slug=request.data["slug"]).first()
        return Response(SiteDetailSerializer(site).data)


class RetrieveUpdateDestroySite(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    lookup_field = "slug"
    serializer_class = SiteDetailSerializer

    def get_queryset(self):
        return Site.objects.filter(owner=self.request.user)

    # TODO ensure update and destroy work
