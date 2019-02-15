from apps.column_headers.utils import trim_dict


class Choice:
    @classmethod
    def get_display(cls, val):
        for c in cls.CHOICES:
            if c[0] == val:
                return c[1]
        return None

    @classmethod
    def get_constants(cls, include_order=False):
        """
        Returns an object with key, values for the class for use in constants api
        CHOICES are made into an object from a list of tuples
        """
        dict_obj = cls.__dict__
        new_dict = trim_dict(dict_obj)
        if 'CHOICES' in new_dict:
            new_dict['CHOICES'] = dict(dict_obj.get('CHOICES'))
            if include_order:
                new_dict['ORDER'] = [choice[0] for choice in cls.CHOICES]
        return new_dict
