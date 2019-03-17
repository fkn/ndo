import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList,
} from 'graphql';
import _ from 'lodash';
import AnswerType from './AnswerType';
import UnitType from './UnitType';
import UserType from './UserType';
import UserCourseRoleType from './UserCourseRoleType';

const CourseType = new ObjectType({
  name: 'CourseType',
  fields: () => ({
    id: { type: new NonNull(StringType) },
    title: { type: new NonNull(StringType) },
    schema: { type: StringType },
    units: {
      args: {
        ids: {
          type: new GraphQLList(StringType),
        },
      },
      type: new GraphQLList(UnitType),
      resolve: (course, args) =>
        course.getUnits({ where: args.ids ? { id: args.ids } : {} }),
    },
    users: {
      args: {
        ids: {
          type: new GraphQLList(StringType),
        },
      },
      type: new GraphQLList(UserType),
      resolve: (course, args) =>
        course.getUsers({ where: args.ids ? { id: args.ids } : {} }),
    },
    role: {
      type: new NonNull(UserCourseRoleType),
      resolve: course => _.get(course, 'userCourse.role'),
    },
    answers: {
      type: new GraphQLList(AnswerType),
      resolve: user => user.getAnswers(),
    },
  }),
});

export default CourseType;
