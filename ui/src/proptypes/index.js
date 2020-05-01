import PropTypes from 'prop-types';

const field = {
  name: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

const input = PropTypes.shape({
  ...field,
  type: PropTypes.string,
});

const error = PropTypes.shape({
  key: PropTypes.any,
  message: PropTypes.string,
  errorType: PropTypes.string.isRequired,
});

const site = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  owner: PropTypes.objectOf(PropTypes.string.isRequired),
});


export default {
  input,
  error,
  site,
};
