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
  column, onChangeSubColumn, setValue, control,
}) => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="subtitle1">{column.name}</Typography>
      <Divider />
      <div className={classes.subfieldContainer}>
        {(column.columns || []).slice().sort(sortColumns).map((c) => (
          <SubFieldSwitcher
            key={`${column.id}-${c.id}`}
            name={`${column.id}-${c.id}`}
            setValue={setValue}
            column={c}
            control={control}
            onChange={(data) => onChangeSubColumn(c, column, data)}
            value={c.data}
          />
        ))}
      </div>
    </>
  );
};

NestedInput.propTypes = {
  onChangeSubColumn: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  column: AppPropTypes.column.isRequired,
};

export default NestedInput;
