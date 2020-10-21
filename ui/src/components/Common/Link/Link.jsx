import React from 'react';

import { Link } from 'react-router-dom';

const ForwardedLink = (linkProps, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Link ref={ref} {...linkProps} />
);

const AppLink = React.forwardRef(ForwardedLink);

export default AppLink;
