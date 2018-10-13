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
import CourseMarks from './CourseMarks';

const title = 'Users of Course';

async function action({ fetch, params, store }) {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `query courses($ids: [String], $userIds: [String]) {
        courses(ids: $ids) {
          id,
          title,
          units {
            id,
            title
            answers(userIds:$userIds) {
              id,
              marks{
                id,
                mark,
                createdAt,
              }
            }
          }
        }
      }`,
      variables: {
        ids: params.idCourse,
        userIds: store.getState().user.id,
      },
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.courses)
    throw new Error('Failed to load user of a course.');
  const mas = [
    [
      {
        title: 'Units',
        action: `/courses/${data.courses[0].id}`,
      },
      {
        title: 'Users list',
        action: `/courses/${data.courses[0].id}/users`,
      },
      {
        title: 'Marks list',
        action: `/courses/${data.courses[0].id}/marks`,
        isActive: true,
      },
    ],
  ];

  return {
    chunks: ['courseMarks'],
    title,
    component: (
      <Layout menuSecond={mas}>
        <CourseMarks course={data.courses[0]} />
      </Layout>
    ),
  };
}

export default action;
