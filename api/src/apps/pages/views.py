from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView, DestroyAPIView, CreateAPIView
from apps.pages.serializers import PageSerializer, PageDetailSerializer, PageColumnSerializer
from apps.pages.models import Page, PageColumnHeader
from apps.sites.models import Site
from rest_framework.response import Response

# Basic Page Data
class ListCreatePage(ListCreateAPIView):
    """
    Endpoint for creating new sites, and also listing out current ones accessible by the user
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = PageSerializer

    def get_queryset(self):
        return Page.objects.filter(site__owner=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        try:
            site = Site.objects.filter(owner=self.request.user, slug=self.kwargs["slug"]).first()
            context.update({'site': site})
            return context
        except Site.DoesNotExist:
            return context

class RetrieveUpdateDestroyPage(RetrieveUpdateDestroyAPIView):
    """
    Endpoint for retrieving , updating general data, or deleting a page by slug
    """
    permission_classes = (IsAuthenticated,)
    lookup_field = "slug"
    lookup_url_kwarg = "page_slug"

    def get_queryset(self):
        return Page.objects.filter(site__owner=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PageDetailSerializer
        return PageSerializer

    def delete(self, request, *args, **kwargs):
        """
        Deletes site by slug and returns deleted site
        """
        page = Page.objects.filter(site__owner=self.request.user, site__slug=self.kwargs["slug"], slug=self.kwargs["page_slug"]).first()
        super().delete(request, *args, **kwargs)
        return Response(PageSerializer(page).data)


# List, Create Page Column
class CreatePageColumn(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = PageColumnSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "page_slug"

    def get_serializer_context(self):
        context = super().get_serializer_context()
        try:
            # get page
            page = Page.objects.filter(site__owner=self.request.user, site__slug=self.kwargs["slug"], slug=self.kwargs["page_slug"]).first()
            context.update({'page': page})
            return context
        except Site.DoesNotExist:
            return context


# Retrieve, Update, Delete Column on Specific Page
class RetrieveUpdateDeleteColumn(RetrieveUpdateDestroyAPIView):
    """
    Endpoint for retrieving / deleting specified pages by slug, and update basic information about page
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = PageColumnSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "column_slug"

    def get_queryset(self):
        return PageColumnHeader.objects.filter(page__site__owner=self.request.user, page__site__slug=self.kwargs["slug"], page__slug=self.kwargs["page_slug"], slug=self.kwargs["column_slug"])

    def delete(self, request, *args, **kwargs):
        """
        Deletes site by slug and returns deleted site
        """
        page_column_header = PageColumnHeader.objects.filter(page__site__owner=self.request.user, page__site__slug=self.kwargs["slug"], page__slug=self.kwargs["page_slug"], slug=self.kwargs["column_slug"]).first()
        super().delete(request, *args, **kwargs)
        return Response(PageColumnSerializer(page_column_header).data)
