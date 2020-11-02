import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Control } from 'react-hook-form';

import { sortColumns } from '_/utils/columns';

import { Button, Grid, Paper } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';

import Input from '_/components/Common/Input/Input';
import FieldSelect from '_/components/Common/FieldSelect/FieldSelect';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: '20px 0',
    boxShadow: 'none',
  },
  grid: {
    border: `1px solid ${theme.palette.border.dark}`,
    '& .MuiGrid-item': {
      marginTop: '14px',
    },
  },
  item: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },
  icon: {
    cursor: 'pointer',
  },
  input: {
    marginTop: '0 !important',
    marginBottom: '5px',
  },
  addButton: {
    marginTop: '15px',
  },
  addSubButton: {
    marginBottom: '15px',
  },
  subColumnContainer: {
    marginLeft: '1rem',
  },
}));

interface Props {
  column: Column;
  control: Control<Record<string, unknown>>;
  addSubColumn(c: Column): void;
  deleteColumn(c: Column): void;
  updateColumn(c: Column): void;
  deleteSubColumn(c: Column, parent: Column): void;
  updateSubColumn(c: Column, parent: Column): void;
  errors: Record<string, FieldError>;
}

const ColumnRow: React.FC<Props> = ({
  column, control,
  addSubColumn, deleteColumn, updateColumn,
  deleteSubColumn, updateSubColumn, errors,
}) => {
  const classes = useStyles();

  // can be used for either editing existing or creating new pages
  return (
    <Paper className={classes.root}>
      <Grid
        container
        spacing={2}
        alignItems="flex-start"
        justify="center"
        className={classes.grid}
      >
        <Grid className={classes.item} item xs={2}>
          <FieldSelect
            selectedField={column.field}
            onChange={(value: string) => updateColumn({ ...column, field: value })}
          />
        </Grid>
        <Grid className={`${classes.item} ${classes.input}`} item xs={4}>
          <Input
            fullWidth
            inputProps={{
              maxLength: 50,
            }}
            field={{
              name: `${column.id}-name`,
              label: 'Column Name',
              value: column.name,
              onChange: (value: string) => updateColumn({ ...column, name: value }),
            }}
            error={!!errors[`${column.id}-name`]}
            message={errors[`${column.id}-name`]?.message}
            rules={{ required: 'Name is required' }}
            control={control}
          />
        </Grid>
        <Grid className={`${classes.item} ${classes.input}`} item xs={4}>
          <Input
            fullWidth
            inputProps={{
              maxLength: 25,
            }}
            field={{
              name: `${column.id}-slug`,
              label: `${column.name} Slug`,
              value: column.slug,
              onChange: (value: string) => updateColumn({ ...column, slug: value }),
            }}
            error={!!errors[`${column.id}-slug`]}
            message={errors[`${column.id}-slug`]?.message}
            rules={{ required: 'Slug is required' }}
            control={control}
          />
        </Grid>
        <Grid className={classes.item} item xs={2}>
          <DeleteIcon
            onClick={() => deleteColumn(column)}
            className={classes.icon}
          />
        </Grid>
      </Grid>
      <div className={classes.subColumnContainer}>
        {(column.columns || []).slice().sort(sortColumns).map((subColumn) => (
          <ColumnRow
            key={subColumn.id}
            column={subColumn}
            addSubColumn={() => null}
            deleteColumn={(c) => deleteSubColumn(c, column)}
            updateColumn={(c) => updateSubColumn(c, column)}
            updateSubColumn={() => null}
            deleteSubColumn={() => null}
            errors={errors}
            control={control}
          />
        ))}
        {column.field === 'OBJECT' ? (
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            className={`${classes.addButton} ${classes.addSubButton}`}
            onClick={() => addSubColumn(column)}
          >
            Add Sub-Field
          </Button>
        ) : null}
      </div>
    </Paper>
  );
};

export default ColumnRow;
