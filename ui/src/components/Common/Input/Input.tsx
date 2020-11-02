import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { TextField, StandardTextFieldProps } from '@material-ui/core';

export interface InputProps extends Omit<StandardTextFieldProps, "variant"> {
  field: Field;
  message?: string;
  rules: Record<string, unknown>;
  control: Control<Record<string, unknown>>;
  variant?: "outlined" | "standard" | undefined;
}

const Input: React.FC<InputProps> = ({
  control, field, rules, message = '', ...props
}) => (
  <Controller
    render={({ name, onChange, value }) => (
      <TextField
        onChange={(event) => {
          if (field.onChange) {
            field.onChange(event?.target.value);
          }
          onChange(event?.target.value)
        }}
        name={name}
        label={field.label}
        type={field.type}
        value={value}
        helperText={message}
        {...props}
      />
    )}
    rules={rules}
    control={control}
    name={field.name}
    defaultValue={field?.value || ''}
  />
);

export default Input;
