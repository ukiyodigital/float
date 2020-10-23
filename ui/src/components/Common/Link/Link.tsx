import React from 'react';

import { Link } from 'react-router-dom';

interface Props {
  to: string;
  children?: JSX.Element;
}

// eslint-disable-next-line react/display-name
const AppLink = React.forwardRef<
  HTMLAnchorElement,
  Props
>(({children, ...props}, ref) => (
  <Link ref={ref} {...props}>
    {children}
  </Link>
));

export default AppLink;
