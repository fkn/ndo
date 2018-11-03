import React from 'react';
import Layout from '../../components/Layout';
import Unit from './Unit';
import { setUnit } from '../../actions/units';

const title = 'Unit';

async function action({ fetch, store }, { idCourse, idUnit }) {
  const { user } = store.getState();
  if (!user) {
    return { redirect: '/login' };
  }
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `query courses($idCourse: [String], $idUnit: [String], $idUser: [String]) { courses(ids: $idCourse) { id title users(ids: $idUser) { role } }
      units(ids: $idUnit) { id title body answers(userIds: $idUser) { createdAt user { profile{ displayName } }
       marks { id mark comment createdAt } } } } `,
      variables: {
        idCourse,
        idUnit,
        idUser: store.getState().user.id,
      },
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.courses.length && !data.units.length)
    throw new Error('Failed to load unit.');
  store.dispatch(setUnit(data.units[0]));
  return {
    chunks: ['unit'],
    title,
    component: (
      <Layout>
        <Unit
          course={data.courses[0]}
          role={data.courses[0].users[0].role || 'teacher'}
        />
      </Layout>
    ),
  };
}

export default action;
