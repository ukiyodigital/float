import React from 'react';

import PropTypes from 'prop-types';
import AppPropTypes from '_/proptypes';

import { v4 as uuidv4 } from 'uuid';

import { makeStyles } from '@material-ui/core/styles';

import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import {
  addColumn, deleteColumn, updateColumn,
  addSubColumn, deleteSubColumn, updateSubColumn,
  sortColumns,
} from '_/utils/columns';

import { GetFlock } from '_/apollo/queries';
import { UpdateFlock } from '_/apollo/mutations';
import { useGetSiteQuery } from '_/hooks';

import {
  Button, Divider, Grid, Snackbar, Switch, Typography,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import AddIcon from '@material-ui/icons/Add';

import FieldRow from '_/components/Common/FieldRow/FieldRow';
import ValueRepeater from '_/components/EditFlock/ValueRepeater/ValueRepeater';

const useStyles = makeStyles(() => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  item: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },
  icon: {
    marginTop: '12px',
  },
  input: {
    marginBottom: '5px',
  },
  addButton: {
    marginTop: '15px',
  },
}));

const EditFlock = ({ flock, updateFlock }) => {
  const classes = useStyles();
  const [columns, setColumns] = React.useState(
    flock.columns.slice().sort(sortColumns),
  );
  const [data, setData] = React.useState(flock.data.slice() || []);
  const [showValues, setShowValues] = React.useState(true);
  // const [errors, dispatch, onError] = useErrorState([]);
  const {
    control, errors, triggerValidation, handleSubmit, setValue,
  } = useForm();

  const updateData = (item) => {
    const itemIdx = data.findIndex((i) => i.id === item.id);
    setData([
      ...data.slice(0, itemIdx),
      item,
      ...data.slice(itemIdx + 1),
    ]);
  };

  const addItem = () => {
    setData([
      ...data,
      {
        id: uuidv4(),
      },
    ]);
  };

  const handleColumnData = ({
    id, unsaved, data: columnData, columns: childColumns = [], value, __typename, ...column
  }, order, isRoot = false) => {
    if (unsaved) {
      return {
        ...column,
        columns: childColumns.map((c, idx) => handleColumnData(c, idx)),
        order,
        // eslint-disable-next-line babel/camelcase
        flock_id: isRoot ? Number(flock.id) : null,
      };
    }
    return {
      ...column,
      columns: childColumns.map((c, idx) => handleColumnData(c, idx)),
      order,
      id,
      // eslint-disable-next-line babel/camelcase
      flock_id: isRoot ? Number(flock.id) : null,
    };
  };

  const handleSave = () => {
    updateFlock({
      ...flock,
      columns: columns.map((c, order) => handleColumnData(c, order, true)),
      data,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <div className={classes.buttonContainer}>
        <Typography component="div">
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>Settings</Grid>
            <Grid item>
              <Switch
                color="primary"
                checked={showValues}
                onChange={async () => {
                  const result = await triggerValidation();
                  if (result) setShowValues(!showValues);
                }}
                name="flock-switch"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </Grid>
            <Grid item>Values</Grid>
          </Grid>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          type="submit"
        >
          Save
        </Button>
      </div>
      {showValues ? (
        <>
          {data.map((item) => (
            <React.Fragment key={item.id}>
              <ValueRepeater
                columns={columns}
                item={item}
                control={control}
                onChange={updateData}
                setValue={setValue}
              />
              <Divider />
            </React.Fragment>
          ))}
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.addButton}
            onClick={addItem}
          >
            <AddIcon />
            Add Item
          </Button>
        </>
      ) : (
        <>
          {columns.map((column) => (
            <FieldRow
              key={column.id}
              column={column}
              updateColumn={(c) => updateColumn(c, columns, setColumns)}
              deleteColumn={(c) => deleteColumn(c, columns, setColumns)}
              addSubColumn={(c) => addSubColumn(c, columns, setColumns)}
              updateSubColumn={(subColumn, parent) => {
                updateSubColumn(subColumn, parent, columns, setColumns);
              }}
              deleteSubColumn={(subColumn, parent) => {
                deleteSubColumn(subColumn, parent, columns, setColumns);
              }}
              errors={errors}
              control={control}
            />
          ))}
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.addButton}
            onClick={() => addColumn(columns, setColumns)}
          >
            <AddIcon />
            Add Field
          </Button>
        </>
      )}
    </form>
  );
};

EditFlock.propTypes = {
  flock: AppPropTypes.flock.isRequired,
  updateFlock: PropTypes.func.isRequired,
};

// eslint-disable-next-line react/jsx-props-no-spreading
const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const EditFlockQuery = () => {
  const [snackbar, setSnackbar] = React.useState(false);
  const { siteSlug, flockSlug } = useParams();
  const [, currentSite] = useGetSiteQuery(siteSlug);
  const {
    loading,
    data: {
      flock,
    } = {},
  } = useQuery(GetFlock, {
    variables: { siteSlug, flockSlug },
  });

  const [updateFlock] = useMutation(UpdateFlock, {
    onCompleted() {
      setSnackbar(true);
    },
  });

  const handleUpdateFlock = ({
    __typename, site, ...f
  }) => {
    updateFlock({ variables: { flock: f, siteId: currentSite.id } });
  };

  return loading ? 'loading' : (
    <>
      <Snackbar open={snackbar} autoHideDuration={6000} onClose={() => setSnackbar(false)}>
        <Alert onClose={() => setSnackbar(false)} severity="success">
          Flock successfully updated.
        </Alert>
      </Snackbar>
      <EditFlock flock={flock} updateFlock={handleUpdateFlock} />
    </>
  );
};

export default EditFlockQuery;
