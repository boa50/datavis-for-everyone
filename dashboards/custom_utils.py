def get_dataset_path(dataset):
    return f"dashboards/datasets/{dataset}"


def check_not_none(value, default=0, attribute=None):
    if value is not None:
        if attribute is not None:
            return value[attribute]
        else:
            return value
    else:
        return default
