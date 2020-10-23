import React from 'react';
import { Control } from 'react-hook-form';
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

interface Props {
  columns: Column[];
  control: Control<Record<string, unknown>>;
  item: Record<string, unknown>;
  deleteItem(item: any): void;
  onChange(value: any): void;
  setValue(name: string, value: any, config: any): void;
}

const ValueRepeater: React.FC<Props> = ({
  columns, control, item, deleteItem, onChange, setValue,
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
            column={{...column, data: item[column.slug] || null}}
            control={control}
            setValue={setValue}
            onChange={(value) => {
              const updatedItem = { ...item };
              updatedItem[`${column.slug}`] = value;
              onChange(updatedItem);
            }}
            onChangeSubColumn={(childColumn: Column, parentColumn: Column, data: any) => {
              const childValue: { [key: string]: any } = {};
              childValue[childColumn.slug] = data;
              const parentItem = item[parentColumn.slug] as Record<string, ColumnValue>;
              const parentValue: { [key: string]: any } = {};
              parentValue[parentColumn.slug] = {
                ...parentItem,
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

export default ValueRepeater;
