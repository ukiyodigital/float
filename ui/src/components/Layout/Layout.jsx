import React from 'react';

import Container from '@material-ui/core/Container';

import Navigation from '_/components/Layout/Navigation/Navigation';
import RouteNode from '_/components/RouteNode/RouteNode';


export default () => (
  <>
    <Navigation />
    <Container>
      <RouteNode />
    </Container>
  </>
);
