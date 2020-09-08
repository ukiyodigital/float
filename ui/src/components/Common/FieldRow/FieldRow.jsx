/* eslint-disable react/forbid-prop-types */
import React from 'react';

import PropTypes from 'prop-types';
import AppPropTypes from '_/proptypes';

import { makeStyles } from '@material-ui/core/styles';

import { sortColumns } from '_/utils/columns';

import { Button, Grid, Paper } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';

import Input from '_/components/Common/Input/Input';
import FieldSelect from '_/components/Common/FieldSelect/FieldSelect';

const useStyles = makeStyles(() => ({
  root: {
    margin: '20px 0',
  },
  item: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },
  icon: {
    cursor: 'pointer',
  },
  grid: {
    '& .MuiGrid-item': {
      marginTop: '14px',
    },
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
    marginRight: '1rem',
  },
}));

const ColumnRow = ({
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
            onChange={(value) => updateColumn({ ...column, field: value })}
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
              onChange: (value) => updateColumn({ ...column, name: value }),
            }}
            error={!!errors[`${column.id}-name`]}
            message={errors[`${column.id}-name`]?.message}
            rules={{ required: 'Name is required' }}
            value={column.name}
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
              onChange: (value) => updateColumn({ ...column, slug: value }),
            }}
            error={!!errors[`${column.id}-slug`]}
            message={errors[`${column.id}-slug`]?.message}
            rules={{ required: 'Slug is required' }}
            value={column.slug}
            control={control}
          />
        </Grid>
        <Grid className={`${classes.item} ${classes.grid}`} item xs={2}>
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

ColumnRow.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  column: AppPropTypes.column.isRequired,
  addSubColumn: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired,
  updateColumn: PropTypes.func.isRequired,
  updateSubColumn: PropTypes.func.isRequired,
  deleteSubColumn: PropTypes.func.isRequired,
};

export default ColumnRow;
