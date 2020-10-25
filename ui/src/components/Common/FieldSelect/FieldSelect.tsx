import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import {
  MenuItem,
  Select,
} from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';

import TitleIcon from '@material-ui/icons/Title';
import CodeIcon from '@material-ui/icons/Code';
import ImageIcon from '@material-ui/icons/Image';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

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

type IconType = typeof TitleIcon | typeof CodeIcon | typeof ImageIcon | typeof AccountTreeIcon;

interface Props {
  selectedField: string;
  onChange(value: string): void;
}

const FieldSelect: React.FC<Props> = ({ selectedField, onChange }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const getIcon = () => {
    const icons: Record<string, IconType> = {
      TEXT: TitleIcon,
      IMAGE: ImageIcon,
      MARKDOWN: CodeIcon,
      OBJECT: AccountTreeIcon,
    };
    const Icon: IconType = icons[selectedField];
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
          if (onChange) onChange(event.target.value as string);
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
        <MenuItem value="MARKDOWN">
          <div className="hide">
            <CodeIcon />
            Markdown
          </div>
        </MenuItem>
        <MenuItem value="IMAGE">
          <div className="hide">
            <ImageIcon />
            Image
          </div>
        </MenuItem>
        <MenuItem value="OBJECT">
          <div className="hide">
            <AccountTreeIcon />
            Object
          </div>
        </MenuItem>
      </Select>
    </>
  );
};

export default FieldSelect;
