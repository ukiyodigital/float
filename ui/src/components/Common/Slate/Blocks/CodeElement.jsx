/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

const CodeElement = ({ attributes, children }) => (
  <pre {...attributes}>
    <code>{children}</code>
  </pre>
);

CodeElement.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
};

CodeElement.defaultProps = {
  attributes: {},
  children: null,
};

export default CodeElement;
