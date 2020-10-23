/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import { Controller } from 'react-hook-form';
import { TextField } from '@material-ui/core';

import AppPropTypes from '_/proptypes';

const ColumnInput = ({
  field, message, value, ...props
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
    defaultValue={value?.value || value || ''}
    helperText={message}
    {...props}
  />
);

ColumnInput.propTypes = {
  message: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  field: AppPropTypes.input.isRequired,
};

ColumnInput.defaultProps = {
  message: '',
  value: {
    value: '',
  },
};

export default ColumnInput;
