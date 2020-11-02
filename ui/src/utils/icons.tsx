import React from 'react';

import AccountTreeIcon from '@material-ui/icons/AccountTree';
import TitleIcon from '@material-ui/icons/Title';
import CodeIcon from '@material-ui/icons/Code';
import ImageIcon from '@material-ui/icons/Image';

export type IconTypes = 'IMAGE' | 'MARKDOWN' | 'TEXT' | 'OBJECT';

export const IconMap: Record<string, React.ReactElement> = ({
  IMAGE: <ImageIcon />,
  MARKDOWN: <CodeIcon />,
  TEXT: <TitleIcon />,
  OBJECT: <AccountTreeIcon />,
});

export default {
  IconMap,
};
