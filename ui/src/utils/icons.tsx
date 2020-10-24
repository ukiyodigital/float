import React from 'react';

import AccountTreeIcon from '@material-ui/icons/AccountTree';
import TitleIcon from '@material-ui/icons/Title';
import CodeIcon from '@material-ui/icons/Code';
import ImageIcon from '@material-ui/icons/Image';

export const IconMap: Record<string, React.ReactElement> = ({
  IMAGE: <ImageIcon fontSize="inherit" />,
  MARKDOWN: <CodeIcon fontSize="inherit" />,
  TEXT: <TitleIcon fontSize="inherit" />,
  OBJECT: <AccountTreeIcon fontSize="inherit" />,
});

export default {
  IconMap,
};
