/* eslint-disable react/forbid-prop-types */
import React from 'react';

import PropTypes from 'prop-types';
import AppPropTypes from '_/proptypes';

import { makeStyles } from '@material-ui/core/styles';

import {
  Accordion, AccordionSummary, AccordionDetails, IconButton, Typography,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import FieldSwitcher from '_/components/Common/FieldSwitcher/FieldSwitcher';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'block',
  },
  item: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const ValueRepeater = ({
  columns, control, deleteItem, item, onChange, setValue,
}) => {
  const classes = useStyles();
  return (
    <Accordion className={classes.item}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <IconButton
          color="inherit"
          onClick={(event) => {
            event.stopPropagation();
            deleteItem(item);
          }}
        >
          <DeleteIcon />
        </IconButton>
        <Typography className={classes.heading}>{`Item ${item.id}`}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.root}>
        {columns.map((column) => (
          <FieldSwitcher
            key={`${item.id}-${column.id}`}
            name={`${item.id}-${column.id}`}
            column={column}
            control={control}
            value={item[column.slug] || null}
            setValue={setValue}
            onChange={(value) => {
              const updatedItem = { ...item };
              updatedItem[`${column.slug}`] = value;
              onChange(updatedItem);
            }}
            onChangeSubColumn={(childColumn, parentColumn, data) => {
              const childValue = {};
              childValue[childColumn.slug] = data;
              const parentValue = {};
              parentValue[parentColumn.slug] = {
                ...item[parentColumn.slug],
                ...childValue,
              };
              const updatedItem = {
                ...item,
                ...parentValue,
              };
              onChange(updatedItem);
            }}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

ValueRepeater.propTypes = {
  columns: PropTypes.arrayOf(AppPropTypes.column),
  setValue: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  control: PropTypes.object.isRequired,
};

ValueRepeater.defaultProps = {
  columns: [],
};

export default ValueRepeater;
