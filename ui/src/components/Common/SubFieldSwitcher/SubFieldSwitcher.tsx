import React from 'react';
import { Control } from 'react-hook-form';

import ColumnInput from '_/components/Common/ColumnInput/ColumnInput';
import FileInput from '_/components/Common/FileInput/FileInput';

import TitleIcon from '@material-ui/icons/Title';
import CodeIcon from '@material-ui/icons/Code';
import ImageIcon from '@material-ui/icons/Image';

export interface FieldSwitcherProps {
  column: Column;
  control: Control<Record<string, unknown>>;
  name: string,
  onChange(v: ColumnValue): void;
  setValue(name: string, value: ColumnValue, config?: Record<string, unknown>): void;
}

const FieldSwitcher: React.FC<FieldSwitcherProps> = ({
  column, control, name, onChange, setValue,
}) => {
  const iconMap: { [key: string]: React.ReactElement } = {
    IMAGE: <ImageIcon fontSize="inherit" />,
    MARKDOWN: <CodeIcon fontSize="inherit" />,
    TEXT: <TitleIcon fontSize="inherit" />,
  };
  const field: Field = {
    name,
    label: (
      <>
        {column.name}
        {iconMap[column.field]}
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
  };

  return map[column.field] || null;
};

export default FieldSwitcher;
