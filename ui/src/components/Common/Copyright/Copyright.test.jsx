import React from 'react';
import { render } from '@testing-library/react';

import Copyright from '_/components/Common/Copyright/Copyright';

test('copyright properly displays', () => {
  const { getByText } = render(
    <Copyright />,
  );

  expect(getByText('Ukiyo Digital')).toBeTruthy();
});
