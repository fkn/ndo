import {
  GraphQLList as List,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';
import CjTestType from './CjTestType';

const CjProblemType = new ObjectType({
  name: 'CjProblemType',
  fields: () => ({
    id: { type: new NonNull(StringType) },
    title: { type: new NonNull(StringType) },
    tests: {
      type: new List(CjTestType),
      resolve: problem => problem.getTests(),
    },
  }),
});

export default CjProblemType;
