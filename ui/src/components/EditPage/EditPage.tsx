import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";

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

import { GetPage } from "_/apollo/queries.graphql";
import { UpdatePage } from "_/apollo/mutations.graphql";
import { useGetSiteQuery } from "_/hooks";

import { Button, Grid, Snackbar, Switch, Typography } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import FieldRow from "_/components/Common/FieldRow/FieldRow";
import FieldSwitcher from "_/components/Common/FieldSwitcher/FieldSwitcher";

import Preview from "_/components/Preview/Preview";
import BoxIcon from "_/components/Common/BoxIcon/BoxIcon";

const { REACT_APP_API_URL: API_URL } = process.env;

const useStyles = makeStyles((theme: Theme) => ({
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
  elementsHeading: {
    fontSize: "20px",
    fontWeight: 300,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    lineHeight: "25px",
    color: theme.palette.primary.dark,
    borderLeft: `4px solid ${theme.palette.primary.light}`,
    padding: `16px 0 16px 24px`,
  },
  iconContainer: {
    marginTop: theme.spacing(4),
  },
}));

interface Props {
  page: Page;
  updatePage(page: Page): void;
}

const EditPage: React.FC<Props> = ({ page, updatePage }) => {
  const classes = useStyles();
  const [columns, setColumns] = useState(
    (page?.columns || []).slice().sort(sortColumns)
  );
  const [showValues, setShowValues] = useState(true);

  // const [errors, dispatch, onError] = useErrorState([]);
  const { control, errors, trigger, handleSubmit, setValue } = useForm();

  const [{ key }] = page?.site?.apiKey || [];
  const url = `${API_URL}?query=query SiteByKey($apiKey: String!, $pageSlug: String!) { pageByKey(apiKey: $apiKey, pageSlug: $pageSlug) { id name slug data } }&operationName=SiteByKey&variables={"apiKey": "${key}", "pageSlug": "${page.slug}"}`;

  const prepColumnData = (
    {
      unsaved,
      id,
      value,
      data,
      columns: childColumns = [],
      __typename: typename,
      ...column
    }: Column,
    isRoot = false,
    order: number
  ): Column => {
    if (unsaved) {
      return {
        ...column,
        columns: childColumns
          .slice()
          .sort(sortColumns)
          .map((c, subOrder) => prepColumnData(c, false, subOrder)),
        data: JSON.stringify(data),
        order,
        page_id: isRoot ? Number(page.id) : null,
      };
    }
    return {
      ...column,
      page_id: isRoot ? Number(page.id) : null,
      columns: childColumns
        .slice()
        .sort(sortColumns)
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
                  const result = await trigger();
                  if (result) setShowValues(!showValues);
                }}
                name="page-switch"
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
        columns.map((column) => (
          <FieldSwitcher
            setValue={setValue}
            key={column.id}
            column={column}
            control={control}
            onChange={(data) =>
              updateColumn({ ...column, data }, columns, setColumns)
            }
            onChangeSubColumn={(childColumn, parentColumn, data) => {
              console.log(data);
              updateSubColumn(
                { ...childColumn, data },
                parentColumn,
                columns,
                setColumns
              );
            }}
          />
        ))
      ) : (
        <Grid container spacing={1}>
          <Grid item md={3}>
            <Typography variant="h2" className={classes.elementsHeading}>
              Elements
            </Typography>
            <div className={classes.iconContainer}>
              <BoxIcon
                icon="TEXT"
                name="text"
                onClick={() => addColumn(columns, setColumns, "TEXT", true)}
              />
              <BoxIcon
                icon="MARKDOWN"
                name="long"
                onClick={() => addColumn(columns, setColumns, "MARKDOWN", true)}
              />
              <BoxIcon
                icon="IMAGE"
                name="img"
                onClick={() => addColumn(columns, setColumns, "IMAGE", true)}
              />
              <BoxIcon
                icon="OBJECT"
                name="object"
                onClick={() => addColumn(columns, setColumns, "OBJECT", true)}
              />
            </div>
          </Grid>
          <Grid item md={9}>
            {columns.map((column) => (
              <FieldRow
                key={column.id}
                column={column}
                updateColumn={(c) => updateColumn(c, columns, setColumns)}
                deleteColumn={(c) => deleteColumn(c, columns, setColumns)}
                addSubColumn={(c) => addSubColumn(c, columns, setColumns, true)}
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
          </Grid>
        </Grid>
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

const EditPageQuery = (): React.ReactElement | "loading" => {
  const [snackbar, setSnackbar] = useState(false);
  const {
    siteSlug,
    pageSlug,
  }: { siteSlug: string; pageSlug: string } = useParams();
  const [, currentSite] = useGetSiteQuery(siteSlug);
  const { loading, data: { page } = {} } = useQuery(GetPage, {
    variables: { siteSlug, pageSlug },
    fetchPolicy: "no-cache",
  });

  const [updatePage] = useMutation(UpdatePage, {
    onCompleted() {
      setSnackbar(true);
    },
  });

  const handleUpdatePage = ({ __typename, site, ...p }: Page) => {
    updatePage({
      variables: { page: p, siteId: currentSite.id },
      refetchQueries: [
        {
          query: GetPage,
          variables: { siteSlug, pageSlug },
        },
      ],
    });
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
          Page successfully updated.
        </Alert>
      </Snackbar>
      <EditPage page={page} updatePage={handleUpdatePage} />
    </>
  );
};

export default EditPageQuery;
