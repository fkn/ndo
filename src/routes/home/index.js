import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

function action({ store }) {
  const { user } = store.getState();
  return {
    title: 'NDO',
    chunks: ['home'],
    component: (
      <Layout>
        <Home user={user} />
      </Layout>
    ),
  };
}

export default action;
