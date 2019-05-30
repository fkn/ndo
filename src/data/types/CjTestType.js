import {
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

const CjTestType = new ObjectType({
  name: 'CjTestType',
  fields: () => ({
    id: { type: new NonNull(StringType) },
    idcjtest: { type: new NonNull(StringType) },
  }),
});

export default CjTestType;
