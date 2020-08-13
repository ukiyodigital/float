/* eslint-disable react/forbid-prop-types */
import React from 'react';

import PropTypes from 'prop-types';
import AppPropTypes from '_/proptypes';

import ColumnInput from '_/components/Common/ColumnInput/ColumnInput';
import FileInput from '_/components/Common/FileInput/FileInput';

import TitleIcon from '@material-ui/icons/Title';
import CodeIcon from '@material-ui/icons/Code';
import ImageIcon from '@material-ui/icons/Image';

const FieldSwitcher = ({
  column, control, onChange, value, name, setValue,
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
    setValue,
  };

  return {
    IMAGE: (
      <FileInput
        field={field}
        value={value}
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
        value={value}
        control={control}
      />
    ),
    TEXT: (
      <ColumnInput
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
  setValue: PropTypes.func.isRequired,
  value: PropTypes.any,
};

export default FieldSwitcher;
