import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import {
  MenuItem,
  Select,
} from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';

import TitleIcon from '@material-ui/icons/Title';
import CodeIcon from '@material-ui/icons/Code';
import ImageIcon from '@material-ui/icons/Image';

const useStyles = makeStyles(() => ({
  icon: {
    cursor: 'pointer',
  },
}));

const IconOnlyInput = withStyles((theme) => ({
  root: {
    '& .MuiSelect-select': {
      padding: 0,
      marginLeft: '5px',
      border: 'none',
    },
    '&& .hide': {
      display: 'none',
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const FieldSelect = ({ selectedField, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const getIcon = () => {
    let Icon = null;
    switch (selectedField) {
      case 'TEXT':
        Icon = TitleIcon;
        break;
      case 'IMAGE':
        Icon = ImageIcon;
        break;
      case 'RICH_TEXT':
        Icon = CodeIcon;
        break;
      default:
        throw new Error();
    }
    return <Icon className={classes.icon} onClick={() => setOpen(true)} />;
  };

  // can be used for either editing existing or creating new pages
  return (
    <>
      {getIcon()}
      <Select
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        onChange={(event) => {
          if (onChange) onChange(event.target.value);
        }}
        value={selectedField}
        input={<IconOnlyInput />}
      >
        <MenuItem value="TEXT">
          <div className="hide">
            <TitleIcon />
            Text
          </div>
        </MenuItem>
        <MenuItem value="RICH_TEXT">
          <div className="hide">
            <CodeIcon />
            Rich Text
          </div>
        </MenuItem>
        <MenuItem value="IMAGE">
          <div className="hide">
            <ImageIcon />
            Image
          </div>
        </MenuItem>
      </Select>
    </>
  );
};

FieldSelect.propTypes = {
  selectedField: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

FieldSelect.defaultProps = {
  onChange: null,
};

export default FieldSelect;
