import React from 'react';
import PropTypes from 'prop-types';

import { FormHelperText } from '@material-ui/core';

import AppPropTypes from '_/proptypes';

const ErrorList = ({ errors }) => (
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

ErrorList.propTypes = {
  errors: PropTypes.arrayOf(AppPropTypes.error).isRequired,
};

export default ErrorList;
