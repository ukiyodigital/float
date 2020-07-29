/* eslint-disable react/forbid-prop-types */
import React from 'react';

import PropTypes from 'prop-types';
import AppPropTypes from '_/proptypes';

import Input from '_/components/Common/Input/Input';

import TitleIcon from '@material-ui/icons/Title';
import CodeIcon from '@material-ui/icons/Code';
import ImageIcon from '@material-ui/icons/Image';

const FieldSwitcher = ({ column, control, updateColumn }) => {
  const field = {
    name: column.slug,
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
    onChange: (value) => updateColumn({ ...column, value }),
  };

  return {
    IMAGE: (
      <Input
        fullWidth
        variant="outlined"
        margin="normal"
        field={field}
        value={column.value}
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
        value={column.value}
        control={control}
      />
    ),
    TEXT: (
      <Input
        fullWidth
        variant="outlined"
        margin="normal"
        field={field}
        value={column.value}
        control={control}
      />
    ),
  }[column.field] || null;
};

FieldSwitcher.propTypes = {
  column: AppPropTypes.column.isRequired,
  updateColumn: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
};

export default FieldSwitcher;
