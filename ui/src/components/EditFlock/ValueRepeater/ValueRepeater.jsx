/* eslint-disable react/forbid-prop-types */
import React from 'react';

import PropTypes from 'prop-types';
import AppPropTypes from '_/proptypes';

import FieldSwitcher from '_/components/Common/FieldSwitcher/FieldSwitcher';

const ValueRepeater = ({
  columns, control, item, onChange,
}) => (
  columns.map((column) => (
    <FieldSwitcher
      key={`${item.id}-${column.id}`}
      name={`${item.id}-${column.id}`}
      column={column}
      control={control}
      value={item[column.slug]}
      onChange={(value) => {
        const updatedItem = item;
        updatedItem[`${column.slug}`] = value;
        onChange(updatedItem);
      }}
    />
  ))
);

ValueRepeater.propTypes = {
  columns: PropTypes.arrayOf(AppPropTypes.column),
  item: PropTypes.object,
  control: PropTypes.object,
};

export default ValueRepeater;
