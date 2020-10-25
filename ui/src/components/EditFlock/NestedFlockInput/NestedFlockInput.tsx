import React from 'react';
import { Control } from 'react-hook-form';

import { makeStyles } from '@material-ui/core/styles';
import { sortColumns } from '_/utils/columns';

import { Typography, Divider } from '@material-ui/core';

import FlockSubFieldSwitcher from '_/components/EditFlock/FlockSubFieldSwitcher/FlockSubFieldSwitcher';

const useStyles = makeStyles(() => ({
  subfieldContainer: {
    marginLeft: '1rem',
  },
}));

interface NestedInputProps {
  column: Column;
  control: Control<Record<string, unknown>>;
  parentValue: Item;
  onChangeSubColumn(column: Column, parent: Column, data: ColumnValue): void;
  setValue(name: string, value: unknown, config?: Record<string, unknown>): void;
}

const NestedFlockInput: React.FC<NestedInputProps> = ({
  column, control, parentValue, onChangeSubColumn, setValue
}) => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="subtitle1" component="h4">{column.name}</Typography>
      <Divider />
      <div className={classes.subfieldContainer}>
        {(column.columns || []).slice().sort(sortColumns).map((c) => (
          <FlockSubFieldSwitcher
            key={`${column.slug}-${column.id}-${c.id}`}
            name={`${column.slug}-${column.id}-${c.id}`}
            column={c}
            control={control}
            parentValue={parentValue[c.slug]}
            setValue={setValue}
            onChange={(data) => onChangeSubColumn(c, column, data)}
          />
        ))}
      </div>
    </>
  );
};

export default NestedFlockInput;
