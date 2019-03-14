from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from apps.pages.serializers import PageSerializer
from apps.pages.models import Page
from apps.sites.models import Site
from rest_framework.response import Response

# create new page
class CreatePage(CreateAPIView):
    """
    Endpoint for creating new sites, and also listing out current ones accessible by the user
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = PageSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        try:
            site = Site.objects.filter(owner=self.request.user, slug=self.kwargs["slug"]).first()
            context.update({'site': site})
            return context
        except Site.DoesNotExist:
            print("noneee")
            return context

    def post(self, request, *args, **kwargs):
        super().post(request, *args, **kwargs)
        return Response("done")

# update page

# delete page

# get page
