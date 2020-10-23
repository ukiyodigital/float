import React from 'react';
import { Control } from 'react-hook-form';

import ColumnInput from '_/components/Common/ColumnInput/ColumnInput';
import FileInput from '_/components/Common/FileInput/FileInput';
import NestedInput from '_/components/Common/NestedInput/NestedInput';

import TitleIcon from '@material-ui/icons/Title';
import CodeIcon from '@material-ui/icons/Code';
import ImageIcon from '@material-ui/icons/Image';

export interface FieldSwitcherProps {
  column: Column;
  control: Control<Record<string, unknown>>;
  onChange(value: ColumnValue): void;
  onChangeSubColumn(c: Column, parent: Column, data: Record<string, unknown>): void;
  setValue(name: string, value: ColumnValue, config?: Record<string, unknown>): void;
}

const FieldSwitcher: React.FC<FieldSwitcherProps> = ({
  column, control, onChange, onChangeSubColumn, setValue,
}) => {
  const IconMap: Record<string, React.ReactElement> = {
    IMAGE: <ImageIcon fontSize="inherit" />,
    MARKDOWN: <CodeIcon fontSize="inherit" />,
    TEXT: <TitleIcon fontSize="inherit" />,
  };
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
