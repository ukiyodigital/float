import React from 'react';
import { Control } from 'react-hook-form';

import ColumnInput from '_/components/Common/ColumnInput/ColumnInput';
import FileInput from '_/components/Common/FileInput/FileInput';

import { IconMap } from '_/utils/icons';

export interface FieldSwitcherProps {
  column: Column;
  parentValue: ColumnValue;
  control: Control<Record<string, unknown>>;
  name: string,
  onChange(v: ColumnValue): void;
  setValue(name: string, value: ColumnValue, config?: Record<string, unknown>): void;
}

const FlockSubFieldSwitcher: React.FC<FieldSwitcherProps> = ({
  column, parentValue, control, name, onChange, setValue,
}) => {
  const icon: React.ReactElement = IconMap[column.field];
  const field: Field = {
    name,
    label: (
      <>
        {column.name}
        {icon}
      </>
    ),
    value: parentValue,
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
  };

  return map[column.field] || null;
};

export default FlockSubFieldSwitcher;
