import React from 'react';
import { Control } from 'react-hook-form';

import ColumnInput from '_/components/Common/ColumnInput/ColumnInput';
import FileInput from '_/components/Common/FileInput/FileInput';
import NestedFlockInput from '_/components/EditFlock/NestedFlockInput/NestedFlockInput';

import { IconMap } from '_/utils/icons';

export interface FieldSwitcherProps {
  column: Column;
  control: Control<Record<string, unknown>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnValue: any;
  onChange(value: ColumnValue): void;
  onChangeSubColumn(c: Column, parent: Column, data: ColumnValue): void;
  setValue(name: string, value: ColumnValue, config?: Record<string, unknown>): void;
}

const FlockFieldSwitcher: React.FC<FieldSwitcherProps> = ({
  column, control, columnValue, onChange, onChangeSubColumn, setValue,
}) => {
  const icon: React.ReactElement = IconMap[column.field];
  const field = {
    name: column.slug,
    label: (
      <>
        {column.name}
        {icon}
      </>
    ),
    value: columnValue,
    onChange,
    setValue,
  };

  const map: { [key: string]: React.ReactElement } = {
    IMAGE: (
      <FileInput
        control={control}
        field={field}
      />
    ),
    MARKDOWN: (
      <ColumnInput
        control={control}
        multiline
        fullWidth
        variant="outlined"
        margin="normal"
        field={field}
      />
    ),
    TEXT: (
      <ColumnInput
        control={control}
        fullWidth
        variant="outlined"
        margin="normal"
        field={field}
      />
    ),
    OBJECT: (
      <NestedFlockInput
        control={control}
        column={column}
        parentValue={columnValue}
        setValue={setValue}
        onChangeSubColumn={onChangeSubColumn}
      />
    ),
  }

  return map[column.field];
};

export default FlockFieldSwitcher;
