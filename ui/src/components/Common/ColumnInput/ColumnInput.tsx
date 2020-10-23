import React from 'react';
import { Controller, Control } from 'react-hook-form';
import TextField, { StandardTextFieldProps } from '@material-ui/core/TextField';


export interface ColumnInputProps extends Omit<StandardTextFieldProps, "variant"> {
  field: Field;
  message?: string;
  variant: "outlined" | "standard" | undefined;
  control: Control<Record<string, unknown>>;
}

const ColumnInput: React.FC<ColumnInputProps> = ({
  control, field, message = '', ...props
}) => (
  <Controller
    control={control}
    render={({ name, value }) => (
      <TextField
        name={name}
        onChange={(e) => {
          if (field.onChange) {
            field.onChange(e.target.value)
          }
          return e.target.value;
        }}
        type={field.type}
        label={field.label}
        helperText={message}
        defaultValue={value}
        {...props}
      />
    )}
    name={field.name}
    defaultValue={field.value}
  />
);

export default ColumnInput;
