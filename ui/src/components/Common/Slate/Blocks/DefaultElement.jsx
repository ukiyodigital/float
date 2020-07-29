/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

const DefaultElement = ({ attributes, children }) => (
  <p {...attributes}>{children}</p>
);

DefaultElement.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
};

DefaultElement.defaultProps = {
  attributes: {},
  children: null,
};

export default DefaultElement;
