import {
  GraphQLInt,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

const CjResponseType = new ObjectType({
  name: 'CjResponseType',
  fields: () => ({
    id: { type: new NonNull(StringType) },
    status: { type: new NonNull(StringType) },
    statusCode: {
      type: GraphQLInt,
    },
  }),
});

export default CjResponseType;
