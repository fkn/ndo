/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLSchema as Schema,
} from 'graphql';
import { answers, createAnswer, updateAnswer } from './queries/answer';
import { createProblem, problems, updateProblem } from './queries/cjproblem';
import {
  addUserToCourse,
  courses,
  createCourse,
  deleteUserFromCourse,
  updateCourse,
} from './queries/course';
import { files, uploadFile } from './queries/file';
import {
  addUserToGroup,
  createGroup,
  deleteUserFromGroup,
  groups,
  updateGroup,
} from './queries/group';
import { createMark, marks, updateMark } from './queries/mark';
import me from './queries/me';
import { createUnit, removeUnit, units, updateUnit } from './queries/unit';
import {
  createUser,
  removeUser,
  setPassword,
  updateUser,
  users,
} from './queries/user';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      me,
      users,
      files,
      courses,
      units,
      answers,
      problems,
      marks,
      groups,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      createCourse,
      createAnswer,
      createProblem,
      createUnit,
      createGroup,
      createUser,
      createMark,
      updateCourse,
      updateProblem,
      updateUnit,
      updateUser,
      updateMark,
      updateAnswer,
      uploadFile,
      addUserToCourse,
      deleteUserFromCourse,
      updateGroup,
      addUserToGroup,
      setPassword,
      deleteUserFromGroup,
      removeUnit,
      removeUser,
    },
  }),
});

export default schema;
