import React from "react";

import { makeStyles, Theme } from "@material-ui/core/styles";

import { Link, LinkProps } from "react-router-dom";
import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    boxShadow: "none",
    textDecoration: "none",
    display: "block",
    color: theme.palette.breadcrumb.dark,
    "& .slug": {
      color: theme.palette.breadcrumb.light,
    },
    "&:hover": {
      "& .text": {
        color: theme.palette.primary.dark,
      },
    },
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
  },
}));

interface Props {
  name: string;
  slug: string;
  siteSlug: string;
  type: TDataType;
  openDeleteModal(name: string, slug: string, type: string): void;
}

const Row: React.FC<Props> = ({
  name,
  slug,
  siteSlug,
  type,
  openDeleteModal,
}) => {
  const classes = useStyles();

  const deletePage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    openDeleteModal(name, slug, type);
  };

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, "to">>(
        (itemProps, ref) => (
          <Link
            to={`/site/${siteSlug}/${type}/${slug}/edit`}
            ref={ref}
            {...itemProps}
          />
        )
      ),
    []
  );

  return (
    <Box className={classes.root} component={renderLink}>
      <Grid container spacing={1}>
        <Grid item xs={11}>
          <Typography className="text">{name}</Typography>
          <Typography className="text">{slug}</Typography>
        </Grid>
        <Grid className={classes.iconContainer} item xs={1}>
          <IconButton onClick={deletePage}>
            <DeleteIcon aria-label="delete" />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Row;
