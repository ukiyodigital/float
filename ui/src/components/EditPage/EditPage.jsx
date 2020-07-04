import React from 'react';

import {
  Paper,
} from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';

import { GetSite } from '_/apollo/queries';

const EditPage = () => {
  const { siteSlug: slug, pageSlug = '' } = useParams();
  const {
    loading,
    data: {
      site,
    } = {},
  } = useQuery(GetSite, {
    variables: { slug },
  });

  console.log(site);

  // can be used for either editing existing or creating new pages
  return loading && pageSlug ? 'loading' : (
    <form>
      <Paper>Test</Paper>
    </form>
  );
};

export default EditPage;
