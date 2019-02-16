from rest_framework.renderers import JSONRenderer


class CustomJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        """
        Custom renderer that all DRF responses use by default to provide a uniform structure to our response JSON.
        The renderer returns a JSON string with "data", "meta", and "errors" keys
        To fill the values of the "meta" and "errors" keys, pass corresponding data into the view.kwargs
        For more information on using this renderer, read the README.md API Endpoints section
        """
        response = renderer_context['response']
        kwargs = renderer_context['kwargs']

        # because we only overwrite the rendered data (aka response.body, after the render is complete),
        # response.data remains the same as before the render
        custom_data = dict()

        # Handles errors thrown by by django
        if response.exception or response.status_code >= 400:
            custom_data['errors'] = list()
            if isinstance(data, dict):
                for k, v in data.items():
                    if isinstance(v, list):
                        for error_value in v:
                            custom_data['errors'].append({"title": k, "detail": error_value})
                    else:
                        custom_data['errors'].append({"title": k, "detail": v})
            elif "errors" not in kwargs:
                custom_data['errors'].append({"detail": data})

        # Handles custom errors
        if "errors" in kwargs:
            assert isinstance(kwargs['errors'], list)
            if "errors" not in custom_data:
                custom_data['errors'] = list()
            custom_data['errors'].extend(kwargs['errors'])

        # if there are no errors, we can simple return the data
        if "errors" not in custom_data:
            custom_data['data'] = data

        custom_data['meta'] = kwargs['meta'] if "meta" in kwargs else dict()

        return super(CustomJSONRenderer, self).render(custom_data, accepted_media_type, renderer_context)
