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
import Course from './Course';
import { setStudyEntities } from '../../actions/study-entities';

async function action({ fetch, params, store }) {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `query courses($ids: [String]) {
        courses(ids: $ids) { id, title, studyEntities{ id,title }, users{ id,email,role } }
      }`,
      variables: {
        ids: params.idCourse,
      },
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.courses) throw new Error('Failed to load course.');
  const course = data.courses[0];
  store.dispatch(setStudyEntities(course.studyEntities));
  const mas = [
    [
      {
        title: 'Study entities',
        action: `/courses/${course.id}`,
        isActive: true,
      },
      {
        title: 'Users list',
        action: `/courses/${course.id}/users`,
      },
      {
        title: 'Marks list',
        action: `/courses/${course.id}/marks`,
      },
    ],
    [
      {
        title: 'Test second level',
        action: `/`,
      },
    ],
  ];
  return {
    title: course.title,
    component: (
      <Layout menuSecond={mas}>
        <Course {...course} />
      </Layout>
    ),
  };
}

export default action;
