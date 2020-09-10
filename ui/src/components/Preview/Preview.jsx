/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import ReactJson from 'react-json-view';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .react-json-view': {
      paddingTop: '1rem',
      height: '100%',
    },
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  url: {
    backgroundColor: 'rgb(39, 40, 34)',
    fontFamily: 'monospace',
    color: 'rgb(249, 248, 245)',
  },
}));

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const Preview = ({ url }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      if (open) {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      }
    };
    fetchData();
  }, [open, url]);

  return (
    <>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        Preview
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        className={classes.root}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Preview
            </Typography>
          </Toolbar>
        </AppBar>
        <Typography className={classes.url}>{url}</Typography>
        <ReactJson src={data} theme="monokai" />
      </Dialog>
    </>
  );
};

Preview.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Preview;
