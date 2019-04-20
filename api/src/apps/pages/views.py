from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView, DestroyAPIView
from apps.pages.serializers import PageSerializer, PageDetailSerializer
from apps.pages.models import Page
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
        page = Page.objects.filter(site__owner=self.request.user, slug=self.kwargs["slug"]).first()
        super().delete(request, *args, **kwargs)
        return Response(PageSerializer(page).data)

# Retrieve, Add, Delete Column on Specific Page
class RetrieveUpdateDeletePage(RetrieveUpdateDestroyAPIView):
    """
    Endpoint for retrieving / deleting specified pages by slug, and update basic information about page
    """
    pass

class UpdatePageColumn(UpdateAPIView):
    """
    Either creates a new column or updates an existing column
    """
    pass

class DeletePageColumn(DestroyAPIView):
    """
    Deletes a column in specified page if it exists
    """
    pass

