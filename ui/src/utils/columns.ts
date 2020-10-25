import { v4 as uuidv4 } from 'uuid';

type SetColumnsType = (columns: Column[]) => void;

export const sortColumns = (a: Column, b: Column): number => a.order - b.order;

export const addColumn = (columns: Column[], setColumns: SetColumnsType, addData = false): void => {
  const newColumn: Column = {
    id: uuidv4(),
    columns: [],
    name: '',
    slug: '',
    field: 'TEXT',
    unsaved: true,
    order: -1, // TODO max of all columns + 1
  };
  if (addData) {
    newColumn.data = '';
  }
  setColumns([
    ...columns,
    newColumn,
  ]);
};

export const updateColumn = (column: Column, columns: Column[], setColumns: SetColumnsType): void => {
  const columnIdx = columns.findIndex((c) => c.id === column.id);
  setColumns([
    ...columns.slice(0, columnIdx),
    column,
    ...columns.slice(columnIdx + 1),
  ]);
};

export const addSubColumn = (column: Column, columns: Column[], setColumns: SetColumnsType, addData = false): void => {
  const newColumn: Column = {
    id: uuidv4(),
    columns: [],
    name: '',
    slug: '',
    field: 'TEXT',
    unsaved: true,
    order: -1 // similar TODO as above
  };
  if (addData) {
    newColumn.data = '';
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

export const deleteColumn = (column: Column, columns: Column[], setColumns: SetColumnsType): void => {
  const columnIdx = columns.findIndex((c) => c.id === column.id);
  setColumns([
    ...columns.slice(0, columnIdx),
    ...columns.slice(columnIdx + 1),
  ]);
};

export const updateSubColumn = (subColumn: Column, parentColumn: Column, columns: Column[], setColumns: SetColumnsType): void => {
  console.log(subColumn);
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

export const deleteSubColumn = (subColumn: Column, parentColumn: Column, columns: Column[], setColumns: SetColumnsType): void => {
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
