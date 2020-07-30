/* eslint-disable react/forbid-prop-types */
import React from 'react';

import PropTypes from 'prop-types';
import AppPropTypes from '_/proptypes';

import Input from '_/components/Common/Input/Input';

import TitleIcon from '@material-ui/icons/Title';
import CodeIcon from '@material-ui/icons/Code';
import ImageIcon from '@material-ui/icons/Image';

const FieldSwitcher = ({
  column, control, onChange, value, name,
}) => {
  const field = {
    name,
    label: (
      <>
        {column.name}
        {
          {
            IMAGE: <ImageIcon fontSize="inherit" />,
            MARKDOWN: <CodeIcon fontSize="inherit" />,
            TEXT: <TitleIcon fontSize="inherit" />,
          }[column.field] || null
        }
      </>
    ),
    onChange,
  };

  return {
    IMAGE: (
      <Input
        fullWidth
        variant="outlined"
        margin="normal"
        field={field}
        value={value}
        control={control}
      />
    ),
    MARKDOWN: (
      <Input
        multiline
        fullWidth
        variant="outlined"
        margin="normal"
        field={field}
        value={value}
        control={control}
      />
    ),
    TEXT: (
      <Input
        fullWidth
        variant="outlined"
        margin="normal"
        field={field}
        value={value}
        control={control}
      />
    ),
  }[column.field] || null;
};

FieldSwitcher.propTypes = {
  column: AppPropTypes.column.isRequired,
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
};

export default FieldSwitcher;
