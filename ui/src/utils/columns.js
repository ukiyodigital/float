import { v4 as uuidv4 } from 'uuid';

export const sortColumns = (a, b) => a.order - b.order;

export const addColumn = (columns, setColumns, addData = false) => {
  const newColumn = {
    id: uuidv4(),
    columns: [],
    name: '',
    slug: '',
    field: 'TEXT',
    unsaved: true,
  };
  if (addData) {
    newColumn.data = {
      value: '',
    };
  }
  setColumns([
    ...columns,
    newColumn,
  ]);
};

export const updateColumn = (column, columns, setColumns) => {
  const columnIdx = columns.findIndex((c) => c.id === column.id);
  setColumns([
    ...columns.slice(0, columnIdx),
    column,
    ...columns.slice(columnIdx + 1),
  ]);
};

export const addSubColumn = (column, columns, setColumns, addData = false) => {
  const newColumn = {
    id: uuidv4(),
    columns: [],
    name: '',
    slug: '',
    field: 'TEXT',
    unsaved: true,
  };
  if (addData) {
    newColumn.data = {
      value: '',
    };
  }

  const updatedColumn = {
    ...column,
    columns: [
      ...column.columns,
      newColumn,
    ],
  };
  updateColumn(updatedColumn, columns, setColumns);
};

export const deleteColumn = (column, columns, setColumns) => {
  const columnIdx = columns.findIndex((c) => c.id === column.id);
  setColumns([
    ...columns.slice(0, columnIdx),
    ...columns.slice(columnIdx + 1),
  ]);
};

export const updateSubColumn = (subColumn, parentColumn, columns, setColumns) => {
  const columnIdx = parentColumn.columns.findIndex((c) => c.id === subColumn.id);
  const updatedColumn = {
    ...parentColumn,
    columns: [
      ...parentColumn.columns.slice(0, columnIdx),
      subColumn,
      ...parentColumn.columns.slice(columnIdx + 1),
    ],
  };

  updateColumn(updatedColumn, columns, setColumns);
};

export const deleteSubColumn = (subColumn, parentColumn, columns, setColumns) => {
  const columnIdx = parentColumn.columns.findIndex((c) => c.id === subColumn.id);
  const updatedColumn = {
    ...parentColumn,
    columns: [
      ...parentColumn.columns.slice(0, columnIdx),
      ...parentColumn.columns.slice(columnIdx + 1),
    ],
  };
  updateColumn(updatedColumn, columns, setColumns);
};

export default {
  addColumn,
  updateColumn,
  deleteColumn,
  addSubColumn,
  updateSubColumn,
  deleteSubColumn,
  sortColumns,
};
