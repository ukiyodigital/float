/* eslint-disable react/forbid-prop-types */
import React from 'react';

import PropTypes from 'prop-types';
import AppPropTypes from '_/proptypes';

import FieldSwitcher from '_/components/Common/FieldSwitcher/FieldSwitcher';

const ValueRepeater = ({
  columns, control, item, onChange, setValue,
}) => (
  columns.map((column) => (
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
  ))
);

ValueRepeater.propTypes = {
  columns: PropTypes.arrayOf(AppPropTypes.column),
  setValue: PropTypes.func.isRequired,
  item: PropTypes.object,
  control: PropTypes.object,
};

export default ValueRepeater;
