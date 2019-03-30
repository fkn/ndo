import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
  GraphQLNonNull as NonNull,
  GraphQLList,
  GraphQLFloat as FloatType,
} from 'graphql';
import AnswerType from './AnswerType';
import CourseType from './CourseType';

const UnitType = new ObjectType({
  name: 'UnitType',
  fields: () => ({
    id: { type: new NonNull(StringType) },
    title: { type: new NonNull(StringType) },
    body: {
      type: new NonNull(StringType),
      resolve: unit => unit.body || '',
    },
    schema: { type: StringType },
    answers: {
      args: {
        userIds: {
          type: new GraphQLList(StringType),
        },
      },
      type: new GraphQLList(AnswerType),
      resolve: (unit, args) => {
        const where = {};
        if (args.userIds) {
          where.userId = args.userIds;
        }
        const courseUnit = unit.CourseUnit;
        if (courseUnit) {
          where.courseId = courseUnit.courseId;
          where.unitId = courseUnit.unitId;
        }
        return unit.getAnswers({ where });
      },
    },
    courses: {
      type: new GraphQLList(CourseType),
      resolve: unit => unit.getCourses(),
    },
    answerable: { type: BooleanType },
    weight: {
      type: new NonNull(FloatType),
      resolve: unit => unit.CourseUnit && unit.CourseUnit.weight,
    },
  }),
});

export default UnitType;
