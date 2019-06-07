/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import sequelize from '../sequelize';
import Answer from './Answer';
import CjProblem from './CjProblem';
import CjTest from './CjTest';
import Course from './Course';
import CourseUnit from './CourseUnit';
import File from './File';
import FileParent from './FileParent';
import Group from './Group';
import Mark from './Mark';
import Unit from './Unit';
import User from './User';
import UserClaim from './UserClaim';
import UserCourse from './UserCourse';
import UserGroup from './UserGroup';
import UserLogin from './UserLogin';
import UserProfile from './UserProfile';

User.hasMany(UserLogin, {
  foreignKey: 'userId',
  as: 'logins',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(UserClaim, {
  foreignKey: 'userId',
  as: 'claims',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

Course.belongsToMany(Unit, {
  as: 'units',
  through: {
    model: CourseUnit,
  },
  foreignKey: 'courseId',
});

Unit.belongsToMany(Course, {
  as: 'courses',
  through: {
    model: CourseUnit,
  },
  foreignKey: 'unitId',
});

User.belongsToMany(Course, {
  as: 'courses',
  through: {
    model: UserCourse,
  },
  foreignKey: 'userId',
});

User.hasMany(File, {
  as: 'files',
});

File.hasMany(FileParent, {
  as: 'parents',
});

Course.belongsToMany(User, {
  as: 'users',
  through: {
    model: UserCourse,
  },
  foreignKey: 'courseId',
});

User.belongsToMany(Group, {
  as: 'groups',
  through: {
    model: UserGroup,
  },
  foreignKey: 'userId',
});

Group.belongsToMany(User, {
  as: 'users',
  through: {
    model: UserGroup,
  },
  foreignKey: 'groupId',
});

User.hasMany(Answer);
Unit.hasMany(Answer);
Course.hasMany(Answer);

Answer.belongsTo(User);
Answer.belongsTo(Unit);
Answer.belongsTo(Course);

Answer.hasMany(Mark);
Mark.belongsTo(Answer);
Mark.belongsTo(User, { as: 'author' });

CjProblem.hasMany(CjTest, {
  foreignKey: 'problemId',
  as: 'tests',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export {
  Answer,
  Course,
  CourseUnit,
  File,
  FileParent,
  Group,
  Mark,
  Unit,
  User,
  CjProblem,
  CjTest,
  UserClaim,
  UserCourse,
  UserGroup,
  UserLogin,
  UserProfile,
};
