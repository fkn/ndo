import React from 'react';
import Layout from '../../components/Layout';
import Unit from './Unit';
import { setUnit } from '../../actions/units';
import unitQuery from '../../gql/unit.gql';

const title = 'Unit';

async function action({ fetch, store }, { idCourse, idUnit }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: unitQuery,
      variables: {
        idCourse,
        idUnit,
        idUser: store.getState().user.id,
      },
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.courses.length && !data.courses[0].units.length)
    throw new Error('Failed to load unit.');
  store.dispatch(setUnit(data.courses[0].units[0]));
  return {
    chunks: ['unit'],
    title,
    component: (
      <Layout>
        <Unit
          course={data.courses[0]}
          role={data.courseRole[0].users[0].role || 'teacher'}
        />
      </Layout>
    ),
  };
}

export default action;
