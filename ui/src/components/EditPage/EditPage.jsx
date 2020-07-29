import React from 'react';

import PropTypes from 'prop-types';
import AppPropTypes from '_/proptypes';

import { v4 as uuidv4 } from 'uuid';

import { makeStyles } from '@material-ui/core/styles';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { GetPage } from '_/apollo/queries';
import { UpdatePage } from '_/apollo/mutations';

import {
  Button, Grid, Snackbar, Switch, Typography, TextField,
} from '@material-ui/core';

import MuiAlert from '@material-ui/lab/Alert';

import AddIcon from '@material-ui/icons/Add';

import FieldRow from '_/components/Common/FieldRow/FieldRow';

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

const EditPage = ({ page, updatePage }) => {
  const classes = useStyles();
  const [columns, setColumns] = React.useState(page.columns.sort((a, b) => a.order - b.order));
  const [showValues, setShowValues] = React.useState(true);
  // const [errors, dispatch, onError] = useErrorState([]);
  const {
    control, errors, triggerValidation, handleSubmit,
  } = useForm();

  const addNewColumn = () => {
    setColumns([
      ...columns,
      {
        id: uuidv4(),
        name: '',
        slug: '',
        field: 'TEXT',
        value: '',
        unsaved: true,
      },
    ]);
  };

  const updateColumn = (column) => {
    const columnIdx = columns.findIndex((c) => c.id === column.id);
    setColumns([
      ...columns.slice(0, columnIdx),
      column,
      ...columns.slice(columnIdx + 1),
    ]);
  };

  const deleteColumn = (column) => {
    const columnIdx = columns.findIndex((c) => c.id === column.id);
    setColumns([
      ...columns.slice(0, columnIdx),
      ...columns.slice(columnIdx + 1),
    ]);
  };

  const handleSave = () => {
    updatePage({
      ...page,
      columns: columns.map(({
        unsaved, id, __typename: typename, ...column
      }, order) => {
        if (unsaved) return { ...column, order };
        return { ...column, order, id };
      }),
    });
  };

  // can be used for either editing existing or creating new pages
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
                name="page-switch"
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
        columns.map((column) => (
          <TextField
            key={column.id}
            fullWidth
            variant="outlined"
            margin="normal"
            control={control}
            label={column.name}
            defaultValue={column.value}
            onChange={(e) => updateColumn({ ...column, value: e.target.value })}
          />
        ))
      ) : (
        <>
          {columns.map((column) => (
            <FieldRow
              key={column.id}
              column={column}
              updateColumn={updateColumn}
              deleteColumn={deleteColumn}
              errors={errors}
              control={control}
            />
          ))}
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.addButton}
            onClick={() => addNewColumn()}
          >
            <AddIcon />
            Add Field
          </Button>
        </>
      )}
    </form>
  );
};

EditPage.propTypes = {
  page: AppPropTypes.page.isRequired,
  updatePage: PropTypes.func.isRequired,
};

// eslint-disable-next-line react/jsx-props-no-spreading
const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const EditPageQuery = () => {
  const [snackbar, setSnackbar] = React.useState(false);
  const { siteSlug, pageSlug } = useParams();
  const {
    loading,
    refetch,
    data: {
      page,
    } = {},
  } = useQuery(GetPage, {
    variables: { siteSlug, pageSlug },
  });

  const [updatePage] = useMutation(UpdatePage, {
    onCompleted() {
      refetch();
      setSnackbar(true);
    },
  });

  const handleUpdatePage = ({
    __typename, site, columns, ...p
  }) => {
    updatePage({ variables: { page: p, columns, siteId: page.site.id } });
  };

  return loading ? 'loading' : (
    <>
      <Snackbar open={snackbar} autoHideDuration={6000} onClose={() => setSnackbar(false)}>
        <Alert onClose={() => setSnackbar(false)} severity="success">
          Page successfully updated.
        </Alert>
      </Snackbar>
      <EditPage page={page} updatePage={handleUpdatePage} />
    </>
  );
};

export default EditPageQuery;
