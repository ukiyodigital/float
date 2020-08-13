/* eslint-disable react/forbid-prop-types */
import React from 'react';

import PropTypes from 'prop-types';
import AppPropTypes from '_/proptypes';

import FieldSwitcher from '_/components/Common/FieldSwitcher/FieldSwitcher';

const ValueRepeater = ({
  columns, control, item, onChange, siteId, setValue,
}) => (
  columns.map((column) => (
    <FieldSwitcher
      siteId={siteId}
      key={`${item.id}-${column.id}`}
      name={`${item.id}-${column.id}`}
      column={column}
      control={control}
      value={item[column.slug]}
      setValue={setValue}
      onChange={(value) => {
        const updatedItem = item;
        updatedItem[`${column.slug}`] = value;
        onChange(updatedItem);
      }}
    />
  ))
);

ValueRepeater.propTypes = {
  siteId: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(AppPropTypes.column),
  setValue: PropTypes.func.isRequired,
  item: PropTypes.object,
  control: PropTypes.object,
};

export default ValueRepeater;
