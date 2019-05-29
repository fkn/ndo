import {
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

const CjProblemType = new ObjectType({
  name: 'CjProblemType',
  fields: () => ({
    id: { type: new NonNull(StringType) },
    title: { type: new NonNull(StringType) },
  }),
});

export default CjProblemType;
