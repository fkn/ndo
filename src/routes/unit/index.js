/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import Unit from './Unit';

const title = 'Unit';

async function action({ fetch, params, store }) {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `query courses($idCourse: [String], $idUnit: [String], $idUser: [String]) {
        courses(ids: $idCourse) { id, title, users(ids: $idUser) { role } },
        units(ids: $idUnit) { id, title, body }
      }`,
      variables: {
        idCourse: params.idCourse,
        idUnit: params.idUnit,
        idUser: store.getState().user.id,
      },
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.courses.length && !data.units.length)
    throw new Error('Failed to load unit.');
  return {
    title,
    component: (
      <Layout showUnitHeaders>
        <Unit
          course={data.courses[0]}
          unit={data.units[0]}
          role={data.courses[0].users[0].role}
        />
      </Layout>
    ),
  };
}

export default action;
