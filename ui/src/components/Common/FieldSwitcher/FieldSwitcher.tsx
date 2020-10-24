import React from 'react';
import { Control } from 'react-hook-form';

import ColumnInput from '_/components/Common/ColumnInput/ColumnInput';
import FileInput from '_/components/Common/FileInput/FileInput';
import NestedInput from '_/components/Common/NestedInput/NestedInput';

import { IconMap } from '_/utils/field';

export interface FieldSwitcherProps {
  column: Column;
  control: Control<Record<string, unknown>>;
  onChange(value: ColumnValue): void;
  onChangeSubColumn(c: Column, parent: Column, data: ColumnValue): void;
  setValue(name: string, value: ColumnValue, config?: Record<string, unknown>): void;
}

const FieldSwitcher: React.FC<FieldSwitcherProps> = ({
  column, control, onChange, onChangeSubColumn, setValue,
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
    value: column?.data || '',
    onChange,
    setValue,
  };

  const map: { [key: string]: React.ReactElement } = {
    IMAGE: (
      <FileInput
        field={field}
        control={control}
      />
    ),
    MARKDOWN: (
      <ColumnInput
        multiline
        fullWidth
        variant="outlined"
        margin="normal"
        field={field}
        control={control}
      />
    ),
    TEXT: (
      <ColumnInput
        fullWidth
        variant="outlined"
        margin="normal"
        field={field}
        control={control}
      />
    ),
    OBJECT: (
      <NestedInput
        column={column}
        control={control}
        setValue={setValue}
        onChangeSubColumn={onChangeSubColumn}
      />
    ),
  }

  return map[column.field];
};

export default FieldSwitcher;
