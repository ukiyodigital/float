import PropTypes from 'prop-types';

const field = {
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func,
};

const input = PropTypes.shape({
  ...field,
  type: PropTypes.string,
});

const error = PropTypes.shape({
  key: PropTypes.string,
  message: PropTypes.string,
  errorType: PropTypes.string.isRequired,
});

const site = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  owner: PropTypes.objectOf(PropTypes.string.isRequired),
});

const column = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.any,
});

const page = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(column),
});

const flock = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(column),
  data: PropTypes.arrayOf(PropTypes.object),
});

export default {
  input,
  error,
  site,
  column,
  page,
  flock,
};
