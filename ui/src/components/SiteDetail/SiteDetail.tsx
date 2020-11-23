import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { useGetSiteQuery, useErrorState } from "_/hooks";

import {
  CreateFlock,
  CreatePage,
  DeleteFlock,
  DeletePage,
} from "_/apollo/mutations.graphql";

import { Button, Container, Divider, Grid } from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

import Loading from "_/components/Common/Loading/Loading";
import FormDialog from "_/components/Common/FormDialog/FormDialog";
import NumberCard from "_/components/SiteDetail/NumberCard/NumberCard";
import Row from "_/components/SiteDetail/Row/Row";

import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
  divider: {
    margin: "25px auto",
  },
  row: {
    borderBottom: "1px solid #EDF6F9",
  },
  button: {
    color: theme.palette.primary.dark,
  },
}));

const CREATE_PAGE_DIALOG = "CREATE_PAGE_DIALOG";
const CREATE_FLOCK_DIALOG = "CREATE_FLOCK_DIALOG";
const DELETE_DIALOG = "DELETE_DIALOG";

type TDialog =
  | typeof CREATE_PAGE_DIALOG
  | typeof CREATE_FLOCK_DIALOG
  | typeof DELETE_DIALOG;

interface IDeleteObject {
  name: string;
  slug: string;
  type: TDataType;
}

const SiteDetail: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [deleteObject, setDeleteObject] = useState<IDeleteObject | null>(null);
  const [activeDialog, setActiveDialog] = useState<TDialog | null>(null);
  const onError = useErrorState([])[2];
  const { siteSlug: slug }: { siteSlug: string } = useParams();
  const [loading, site, refetch] = useGetSiteQuery(slug);
  const [createPage] = useMutation(CreatePage, {
    onCompleted({ createPage }) {
      history.push(`/site/${site.slug}/page/${createPage.page.slug}/edit`);
      setActiveDialog(null);
    },
    onError,
  });
  const [createFlock] = useMutation(CreateFlock, {
    onCompleted({ createFlock }) {
      history.push(`/site/${site.slug}/flock/${createFlock.flock.slug}/edit`);
      setActiveDialog(null);
    },
    onError,
  });
  const [deletePage] = useMutation(DeletePage, {
    async onCompleted() {
      await refetch();
      setActiveDialog(null);
    },
    onError,
  });
  const [deleteFlock] = useMutation(DeleteFlock, {
    async onCompleted() {
      await refetch();
      setActiveDialog(null);
    },
    onError,
  });

  const handleCloseDialog = () => setActiveDialog(null);

  const openDeleteModal = (name: string, slug: string, type: TDataType) => {
    setDeleteObject({ name, slug, type });
    setActiveDialog(DELETE_DIALOG);
  };

  const handleDelete = async () => {
    const { type, slug } = deleteObject || {};
    switch (type) {
      case "PAGE":
        await deletePage({ variables: { siteId: site.id, slug } });
        break;
      case "FLOCK":
        await deleteFlock({ variables: { siteId: site.id, slug } });
        break;
      default:
    }
  };

  return loading ? (
    <Loading loading />
  ) : (
    <Container className={classes.root}>
      <FormDialog
        open={activeDialog === DELETE_DIALOG}
        title={`Are you sure you want to delete ${deleteObject?.name}?`}
        content={`Please confirm you'd like to delete this ${deleteObject?.type}`}
        handleClose={() => {
          handleCloseDialog();
          setDeleteObject(null);
        }}
        submitData={handleDelete}
        submitText="Delete"
        submitButtonProps={{
          startIcon: <DeleteIcon />,
          color: "secondary",
          variant: "contained",
        }}
      />
      <FormDialog
        open={activeDialog === CREATE_PAGE_DIALOG}
        title="Create New Page"
        content="Choose a name and a unique slug for the page."
        handleClose={handleCloseDialog}
        submitData={(data: Record<string, string>) => {
          createPage({ variables: { siteId: site.id, page: data } });
        }}
        submitButtonProps={{
          startIcon: <SaveIcon />,
          color: "primary",
          variant: "contained",
        }}
        fields={[
          {
            name: "name",
            label: "Page Name",
            rules: { required: "Page name is required " },
          },
          {
            name: "slug",
            label: "Page Slug",
            rules: { required: "Page slug is required " },
            inputProps: {
              maxLength: 15,
            },
          },
        ]}
      />
      <FormDialog
        open={activeDialog === CREATE_FLOCK_DIALOG}
        title="Create New Flock"
        content="Choose a name and a unique slug for the flock."
        handleClose={handleCloseDialog}
        submitData={(data: Record<string, string>) => {
          createFlock({ variables: { siteId: site.id, flock: data } });
        }}
        submitButtonProps={{
          startIcon: <SaveIcon />,
          color: "primary",
          variant: "contained",
        }}
        fields={[
          {
            name: "name",
            label: "Flock Name",
            rules: { required: "Flock name is required " },
          },
          {
            name: "slug",
            label: "Flock Slug",
            rules: { required: "Flock slug is required " },
            inputProps: {
              maxLength: 15,
            },
          },
        ]}
      />
      <Grid>
        <Grid item xs={12} className={classes.root}>
          <Grid container spacing={3} justify="space-between">
            <Grid item xs={3}>
              <NumberCard name="Pages" number={site.pages.length} />
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={2}>
                {site?.pages?.map((page: Page) => (
                  <Grid item xs={12} key={page.id} className={classes.row}>
                    <Row
                      type="PAGE"
                      name={page.name}
                      slug={page.slug}
                      siteSlug={site.slug}
                      openDeleteModal={openDeleteModal}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    className={classes.button}
                    color="primary"
                    onClick={() => setActiveDialog(CREATE_PAGE_DIALOG)}
                  >
                    <AddIcon />
                    New Page
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid>
        <Grid item xs={12}>
          <Grid container spacing={3} justify="space-between">
            <Grid item xs={3}>
              <NumberCard name="Flocks" number={site?.flocks?.length} />
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={2}>
                {site?.flocks?.map((flock: Flock) => (
                  <Grid key={flock.id} item xs={12} className={classes.row}>
                    <Row
                      type="FLOCK"
                      name={flock.name}
                      slug={flock.slug}
                      siteSlug={site.slug}
                      openDeleteModal={openDeleteModal}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button
                    className={classes.button}
                    color="primary"
                    fullWidth
                    onClick={() => setActiveDialog(CREATE_FLOCK_DIALOG)}
                  >
                    <AddIcon />
                    New Flock
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SiteDetail;
