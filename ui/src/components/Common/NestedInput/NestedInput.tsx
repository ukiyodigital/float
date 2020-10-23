/* eslint-disable react/forbid-prop-types */
import React from 'react';

import PropTypes from 'prop-types';
import AppPropTypes from '_/proptypes';

import { makeStyles } from '@material-ui/core/styles';
import { sortColumns } from '_/utils/columns';

import { Typography, Divider } from '@material-ui/core';

import SubFieldSwitcher from '_/components/Common/SubFieldSwitcher/SubFieldSwitcher';

const useStyles = makeStyles(() => ({
  subfieldContainer: {
    marginLeft: '1rem',
  },
}));

const NestedInput = ({
  field, value, column, onChangeSubColumn, setValue, control, isPage,
}) => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="subtitle1" component="h4">{column.name}</Typography>
      <Divider />
      <div className={classes.subfieldContainer}>
        {(column.columns || []).slice().sort(sortColumns).map((c) => {
          // since page data is stored in individual columns
          // we need to access the values differently
          const flockValue = value && !isPage ? value[c.slug] : null;
          return (
            <SubFieldSwitcher
              key={`${field.name}-${column.id}-${c.id}`}
              name={`${field.name}-${column.id}-${c.id}`}
              setValue={setValue}
              column={c}
              control={control}
              onChange={(data) => onChangeSubColumn(c, column, data)}
              value={isPage ? c.data : flockValue}
            />
          );
        })}
      </div>
    </>
  );
};

NestedInput.propTypes = {
  onChangeSubColumn: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  setValue: PropTypes.func.isRequired,
  column: AppPropTypes.column.isRequired,
  field: AppPropTypes.input.isRequired,
  isPage: PropTypes.bool,
};

NestedInput.defaultProps = {
  value: null,
  isPage: false,
};

export default NestedInput;
