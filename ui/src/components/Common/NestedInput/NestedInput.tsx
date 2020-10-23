import React from 'react';
import { Control } from 'react-hook-form';

import { makeStyles } from '@material-ui/core/styles';
import { sortColumns } from '_/utils/columns';

import { Typography, Divider } from '@material-ui/core';

import SubFieldSwitcher from '_/components/Common/SubFieldSwitcher/SubFieldSwitcher';

const useStyles = makeStyles(() => ({
  subfieldContainer: {
    marginLeft: '1rem',
  },
}));

interface NestedInputProps {
  column: Column;
  control: Control<Record<string, unknown>>;
  onChangeSubColumn(column: Column, parent: Column, data: ColumnValue): void;
  setValue(name: string, value: unknown, config?: Record<string, unknown>): void;
}

const NestedInput: React.FC<NestedInputProps> = ({
  column, control, onChangeSubColumn, setValue
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
          // const flockValue = c?.data && !isPage ? c.data[c.slug] : '';
          return (
            <SubFieldSwitcher
              key={`${column.slug}-${column.id}-${c.id}`}
              name={`${column.slug}-${column.id}-${c.id}`}
              column={c}
              control={control}
              setValue={setValue}
              onChange={(data) => onChangeSubColumn(c, column, data)}
            />
          );
        })}
      </div>
    </>
  );
};

export default NestedInput;
