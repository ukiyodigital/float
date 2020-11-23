import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { makeStyles } from "@material-ui/core/styles";

import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  addColumn,
  deleteColumn,
  updateColumn,
  addSubColumn,
  deleteSubColumn,
  updateSubColumn,
  sortColumns,
} from "_/utils/columns";

import { GetFlock } from "_/apollo/queries.graphql";
import { UpdateFlock } from "_/apollo/mutations.graphql";
import { useGetSiteQuery } from "_/hooks";

import { Button, Grid, Snackbar, Switch, Typography } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import AddIcon from "@material-ui/icons/Add";

import FieldRow from "_/components/Common/FieldRow/FieldRow";
import ValueRepeater from "_/components/EditFlock/ValueRepeater/ValueRepeater";

import Preview from "_/components/Preview/Preview";

const { REACT_APP_API_URL: API_URL } = process.env;

const useStyles = makeStyles(() => ({
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  item: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },
  icon: {
    marginTop: "12px",
  },
  input: {
    marginBottom: "5px",
  },
  addButton: {
    marginTop: "15px",
  },
}));

interface Props {
  flock: Flock;
  updateFlock(flock: Flock): void;
}

const EditFlock: React.FC<Props> = ({ flock, updateFlock }) => {
  const classes = useStyles();
  const [columns, setColumns] = useState(
    (flock?.columns || []).slice().sort(sortColumns)
  );
  const [data, setData] = useState(flock?.data?.slice() || []);
  const [showValues, setShowValues] = useState(true);
  const { control, errors, trigger, handleSubmit, setValue } = useForm();

  const [{ key }] = flock?.site?.apiKey || [];
  const url = `${API_URL}?query=query FlockByKey($apiKey: String!, $flockSlug: String!) { flockByKey(apiKey: $apiKey, flockSlug: $flockSlug) { id name slug data } }&operationName=FlockByKey&variables={"apiKey": "${key}", "flockSlug": "${flock.slug}"}`;

  const updateData = (item: Item) => {
    const itemIdx = data.findIndex((i: Item) => i.id === item.id);
    setData([...data.slice(0, itemIdx), item, ...data.slice(itemIdx + 1)]);
  };

  const deleteItem = (item: Item) => {
    const itemIdx = data.findIndex((i: Item) => i.id === item.id);
    setData([...data.slice(0, itemIdx), ...data.slice(itemIdx + 1)]);
  };

  const addItem = () => {
    setData([
      ...data,
      {
        id: uuidv4(),
      },
    ]);
  };

  const handleColumnData = (
    {
      id,
      unsaved,
      data: columnData,
      columns: childColumns = [],
      value,
      __typename,
      ...column
    }: Column,
    order: number,
    isRoot = false
  ): Column => {
    if (unsaved) {
      return {
        ...column,
        columns: childColumns.map((c, idx) => handleColumnData(c, idx)),
        order,
        flock_id: isRoot ? Number(flock.id) : null,
      };
    }
    return {
      ...column,
      columns: childColumns.map((c, idx) => handleColumnData(c, idx)),
      order,
      id,
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
                  const result = await trigger();
                  if (result) setShowValues(!showValues);
                }}
                name="flock-switch"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            </Grid>
            <Grid item>Values</Grid>
          </Grid>
        </Typography>
        <Preview url={url} />
        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
      </div>
      {showValues ? (
        <>
          {data.map((item: Item) => (
            <ValueRepeater
              key={item.id}
              columns={columns}
              control={control}
              item={item}
              deleteItem={deleteItem}
              onChange={updateData}
              setValue={setValue}
            />
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

interface AlertProps {
  onClose(): void;
  severity?: "success" | "info" | "warning" | "error";
}
// eslint-disable-next-line react/jsx-props-no-spreading
const Alert: React.FC<AlertProps> = (props) => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

const EditFlockQuery = (): React.ReactElement | "loading" => {
  const [snackbar, setSnackbar] = useState(false);
  const {
    siteSlug,
    flockSlug,
  }: { siteSlug: string; flockSlug: string } = useParams();
  const [, currentSite] = useGetSiteQuery(siteSlug);
  const { loading, data: { flock } = {} } = useQuery(GetFlock, {
    variables: { siteSlug, flockSlug },
    fetchPolicy: "no-cache",
  });

  const [updateFlock] = useMutation(UpdateFlock, {
    onCompleted() {
      setSnackbar(true);
    },
  });

  const handleUpdateFlock = ({ __typename, site, ...f }: Flock) => {
    updateFlock({ variables: { flock: f, siteId: currentSite.id } });
  };

  return loading ? (
    "loading"
  ) : (
    <>
      <Snackbar
        open={snackbar}
        autoHideDuration={6000}
        onClose={() => setSnackbar(false)}
      >
        <Alert onClose={() => setSnackbar(false)} severity="success">
          Flock successfully updated.
        </Alert>
      </Snackbar>
      <EditFlock flock={flock} updateFlock={handleUpdateFlock} />
    </>
  );
};

export default EditFlockQuery;
