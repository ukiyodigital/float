import React from 'react';
import { FormHelperText } from '@material-ui/core';

interface Props {
  errors: FloatError[];
}

const ErrorList: React.FC<Props> = ({ errors = [] }) => (
  errors ? (
    <>
      {errors.map(({ key, message }) => (
        <FormHelperText error key={key}>
          {message}
        </FormHelperText>
      ))}
    </>
  ) : null
);

export default ErrorList;
