class ColumnManager:
    def __init__(self, model, has_data_property = True):
        self.model = model
        self.existing_columns = dict()
        self.existing_column_ids = []

        self.has_data_property = has_data_property

    def create_column(self, column):
        created_columns = []
        columns = column.pop('columns', [])
        c = self.model(**column)
        c.save()
        for sub_column in columns:
            sub_column['parent'] = c
            created_columns += self.create_column(sub_column)
        return created_columns

    def create_new_columns(self, columns, page_id):
        new_columns = []
        for column in columns:
            new_columns += self.create_column(column)
        return new_columns

    def update_column(self, column, existing_column):
        new_columns = []
        existing_column.name = column.get('name', existing_column.name)
        existing_column.slug = column.get('slug', existing_column.slug)
        existing_column.order = column.get('order', existing_column.order)
        existing_column.field = column.get('field', existing_column.field)
        if self.has_data_property:
            existing_column.data = column.get('data', {})

        columns = column.get('columns', [])

        existing_column.columns.exclude(id__in=[c.id for c in columns if c.id]).delete()
        for sub_column in columns:
            if sub_column.id:
                self.update_column(sub_column, self.existing_columns[sub_column.id]['current'])
                continue
            new_columns += self.create_column(column)

        return new_columns

    def _loop_columns(self, columns = []):
        for column in columns:
            if column.id:
                self.existing_columns[str(column.id)] = {}
                self.existing_columns[str(column.id)]['update'] = column
                self.existing_column_ids.append(column.id)
                self._loop_columns(column.get('columns', []))


    def find_existing_columns(self, columns):
        self._loop_columns(columns)

        for column in self.model.objects.filter(id__in=self.existing_column_ids):
            self.existing_columns[str(column.id)]['current'] = column


    def update_existing_columns(self, columns):
        new_columns = []

        for column_id in self.existing_columns.keys():
            update = self.existing_columns[str(column_id)]['update']
            current = self.existing_columns[str(column_id)]['current']
            new_columns += self.update_column(
                update,
                current,
            )

        return new_columns

    def save_columns(self, columns, id):
        self.find_existing_columns(columns)
        new_columns = self.update_existing_columns(columns)

        new_columns += self.create_new_columns([c for c in columns if not c.id], id)

        self.model.objects.bulk_update(
            [column['current'] for column in self.existing_columns.values()],
            ['name', 'slug', 'order', 'field', 'data']
        )

        self.model.objects.bulk_create(new_columns)
