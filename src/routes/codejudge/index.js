import React from 'react';
import Layout from '../../components/Layout/Layout';
import problemsQuery from '../../gql/problems.gql';
import Codejudge from './Codejudge';

const title = 'Codejudge Problems';

async function action({ fetch, store }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }
  const res = await fetch('/graphql', {
    body: JSON.stringify({
      query: problemsQuery,
    }),
  });
  const { data } = await res.json();
  if (!data) throw new Error('Failed to load problems.');
  return {
    chunks: ['codejudge'],
    title,
    component: (
      <Layout>
        <Codejudge title={title} problems={data.problems} />
      </Layout>
    ),
  };
}

export default action;
