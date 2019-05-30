import {
  GraphQLList as List,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';
import { NoAccessError, NotLoggedInError } from '../../errors';
import CjTest from '../models/CjTest';
import CjTestType from '../types/CjTestType';

const createCjTest = {
  type: CjTestType,
  args: {
    idcjtest: {
      description: 'The id of the test in codejudge',
      type: new NonNull(StringType),
    },
  },
  async resolve({ request }, args) {
    const { user } = request;
    if (!user) throw new NotLoggedInError();
    if (!user.isAdmin) throw new NoAccessError();
    return CjTest.create({
      ...args,
    });
  },
};

const cjTests = {
  type: new List(CjTestType),
  args: {
    ids: {
      description: 'ids of the cjTests',
      type: new List(StringType),
    },
  },
  resolve(obj, args) {
    const where = {};
    if (args.ids) {
      where.id = args.ids;
    }
    return CjTest.findAll({ where });
  },
};

export { createCjTest, cjTests };
