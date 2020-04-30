import React from 'react';
import PropTypes from 'prop-types';

import { Controller } from 'react-hook-form';
import { TextField } from '@material-ui/core';

import AppPropTypes from '_/proptypes';

const Input = ({
  error, field, message, value, ...props
}) => (
  <Controller
    as={TextField}
    onChange={([{ target: { value: v } }]) => {
      field.onChange(v);
      return v;
    }}
    name={field.name}
    label={field.label}
    type={field.type}
    defaultValue={value}
    error={error}
    helperText={message}
    variant="outlined"
    margin="normal"
    fullWidth
    {...props}
  />
);

Input.propTypes = {
  error: PropTypes.bool,
  message: PropTypes.string,
  value: PropTypes.string.isRequired,
  field: AppPropTypes.input.isRequired,
};

Input.defaultProps = {
  error: null,
  message: '',
};

export default Input;
