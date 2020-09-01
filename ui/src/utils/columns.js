import { v4 as uuidv4 } from 'uuid';

export const addColumn = (columns, setColumns) => {
  setColumns([
    ...columns,
    {
      id: uuidv4(),
      name: '',
      slug: '',
      field: 'TEXT',
      value: '',
      unsaved: true,
    },
  ]);
};

export const addSubColumn = (column, columns, setColumns) => {

};

export const updateColumn = (column, columns, setColumns) => {
  const columnIdx = columns.findIndex((c) => c.id === column.id);
  setColumns([
    ...columns.slice(0, columnIdx),
    column,
    ...columns.slice(columnIdx + 1),
  ]);
};

export const deleteColumn = (column, columns, setColumns) => {
  const columnIdx = columns.findIndex((c) => c.id === column.id);
  setColumns([
    ...columns.slice(0, columnIdx),
    ...columns.slice(columnIdx + 1),
  ]);
};

export default {
  addColumn,
  updateColumn,
  deleteColumn,
};
