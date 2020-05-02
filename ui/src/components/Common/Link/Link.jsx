import React from 'react';

import { Link } from 'react-router-dom';

const AppLink = React.forwardRef((linkProps, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Link ref={ref} {...linkProps} />
));

export default AppLink;
