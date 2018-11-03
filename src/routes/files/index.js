import React from 'react';
import Layout from '../../components/Layout';
import Files from './Files';
import { fetchFiles } from '../../actions/files';

const title = 'Files';

async function action({ store }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }
  await store.dispatch(fetchFiles());
  return {
    chunks: ['files'],
    title,
    component: (
      <Layout>
        <Files title={title} />
      </Layout>
    ),
  };
}

export default action;
