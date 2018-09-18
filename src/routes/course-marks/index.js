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
<<<<<<< HEAD
<<<<<<< HEAD
import CourseMarks from './CourseMarks';
=======
import AnswerList from './AnswerList';
>>>>>>> markset
=======
import AnswerList from './AnswerList';
>>>>>>> markset

const title = 'Users of Course';

async function action({ fetch, params }) {
  const resp = await fetch('/graphql', {
    body: JSON.stringify({
      query: `query courses($ids: [String]) {
        courses(ids: $ids) { id, title, 
          studyEntities {
          id,
          title
          answers{
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
      },
    }),
  });
  const { data } = await resp.json();
  if (!data && !data.courses)
    throw new Error('Failed to load user of a course.');
  const mas = [
    [
      {
        title: 'Study entities',
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
<<<<<<< HEAD
<<<<<<< HEAD

=======
=======
>>>>>>> markset
  const stadyEntitys = [
    {
      title: 'First Entity',
      answers: [
        {
          title: 'first answer',
          id: '1',
          deadline: '15 сент',
          mark: '100%',
        },
        {
          title: 'second answer',
          id: '2',
          deadline: '15 сент',
          mark: '100%',
        },
        {
          title: 'third answer',
          id: '3',
          deadline: '15 сент',
          mark: '100%',
        },
      ],
    },
    {
      title: 'second Entity',
      answers: [
        {
          title: 'first answer',
          id: '1',
          deadline: '15 сент',
          mark: '100%',
        },
        {
          title: 'second answer',
          id: '2',
          deadline: '15 сент',
          mark: '100%',
        },
        {
          title: 'third answer',
          id: '3',
          deadline: '15 сент',
          mark: '100%',
        },
      ],
    },
  ];
<<<<<<< HEAD
>>>>>>> markset
=======
>>>>>>> markset
  return {
    title,
    component: (
      <Layout menuSecond={mas}>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        <CourseMarks course={data.courses[0]} />
=======
=======
>>>>>>> markset
        <AnswerList
          answers={stadyEntitys[0].answers}
          stydyEntity={stadyEntitys[0]}
        />
<<<<<<< HEAD
>>>>>>> markset
=======
        {stadyEntitys.map(ent => (
          <AnswerList answers={ent.answers} stydyEntity={ent} />
        ))}
>>>>>>> add somethings
=======
>>>>>>> markset
=======
        {stadyEntitys.map(ent => (
          <AnswerList answers={ent.answers} stydyEntity={ent} />
        ))}
>>>>>>> add somethings
      </Layout>
    ),
  };
}

export default action;
