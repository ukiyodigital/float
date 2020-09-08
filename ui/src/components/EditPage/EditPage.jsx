import React from 'react';

import PropTypes from 'prop-types';
import AppPropTypes from '_/proptypes';

import { makeStyles } from '@material-ui/core/styles';

import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import {
  addColumn, deleteColumn, updateColumn,
  addSubColumn, deleteSubColumn, updateSubColumn,
  sortColumns,
} from '_/utils/columns';

import { GetPage } from '_/apollo/queries';
import { UpdatePage } from '_/apollo/mutations';
import { useGetSiteQuery } from '_/hooks';

import {
  Button, Grid, Snackbar, Switch, Typography,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import AddIcon from '@material-ui/icons/Add';

import FieldRow from '_/components/Common/FieldRow/FieldRow';
import FieldSwitcher from '_/components/Common/FieldSwitcher/FieldSwitcher';

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
  const [columns, setColumns] = React.useState([]);
  const [showValues, setShowValues] = React.useState(true);

  // const [errors, dispatch, onError] = useErrorState([]);
  const {
    control, errors, triggerValidation, handleSubmit, setValue,
  } = useForm();

  React.useEffect(() => {
    setColumns(page.columns.slice().sort(sortColumns));
  }, [page.columns]);

  const prepColumnData = ({
    unsaved, id, value, data, columns: childColumns = [], __typename: typename, ...column
  }, isRoot = false, order) => {
    if (unsaved) {
      return {
        ...column,
        columns: childColumns.slice().sort(sortColumns)
          .map((c, subOrder) => prepColumnData(c, false, subOrder)),
        data: JSON.stringify(data),
        order,
        // eslint-disable-next-line babel/camelcase
        page_id: isRoot ? Number(page.id) : null,
      };
    }
    return {
      ...column,
      // eslint-disable-next-line babel/camelcase
      page_id: isRoot ? Number(page.id) : null,
      columns: childColumns.slice().sort(sortColumns)
        .map((c, subOrder) => prepColumnData(c, false, subOrder)),
      data: JSON.stringify(data),
      order,
      id,
    };
  };

  const handleSave = () => {
    updatePage({
      ...page,
      columns: columns.map((c, i) => prepColumnData(c, true, i)),
    });
  };

  // can be used for either editing existing or creating new pages
  return (
    <form onSubmit={handleSubmit(handleSave)} encType="multipart/form-data">
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
      {showValues ? columns.map((column) => (
        <FieldSwitcher
          setValue={setValue}
          key={column.id}
          column={column}
          control={control}
          name={column.slug}
          onChange={(data) => updateColumn({ ...column, data }, columns, setColumns)}
          onChangeSubColumn={(childColumn, parentColumn, data) => {
            updateSubColumn({ ...childColumn, data }, parentColumn, columns, setColumns);
          }}
          value={column.data}
        />
      )) : (
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

EditPage.propTypes = {
  page: AppPropTypes.page.isRequired,
  updatePage: PropTypes.func.isRequired,
};

// eslint-disable-next-line react/jsx-props-no-spreading
const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const EditPageQuery = () => {
  const [snackbar, setSnackbar] = React.useState(false);
  const { siteSlug, pageSlug } = useParams();
  const [, currentSite] = useGetSiteQuery(siteSlug);
  const {
    loading,
    data: {
      page,
    } = {},
  } = useQuery(GetPage, {
    variables: { siteSlug, pageSlug },
  });

  const [updatePage] = useMutation(UpdatePage, {
    onCompleted() {
      setSnackbar(true);
    },
  });

  const handleUpdatePage = ({
    __typename, site, ...p
  }) => {
    updatePage({
      variables: { page: p, siteId: currentSite.id },
      refetchQueries: [{
        query: GetPage,
        variables: { siteSlug, pageSlug },
      }],
    });
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
