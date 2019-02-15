def trim_dict(dict_obj):
    new_dict = {}
    for key in dict_obj.keys():
        if not (key.startswith('__') and key.endswith('__')):
            new_dict[key] = dict_obj[key]
    return new_dict
