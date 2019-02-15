class CsrfHeaderMiddleware:
    def __init__(self, get_response):
        # one-time configuration and initialization.
        self.get_response = get_response

    def __call__(self, request):

        response = self.get_response(request)

        if "CSRF_COOKIE" in request.META:
            # csrfviewmiddleware sets response cookie as request.META['CSRF_COOKIE']
            response["X-CSRFTOKEN"] = request.META['CSRF_COOKIE']
        return response
