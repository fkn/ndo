import {
  GraphQLList as List,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';
import { NoAccessError, NotLoggedInError } from '../../errors';
import CjProblem from '../models/CjProblem';
import CjProblemType from '../types/CjProblemType';

const createProblem = {
  type: CjProblemType,
  args: {
    title: {
      description: 'The title of the new problem',
      type: new NonNull(StringType),
    },
  },
  async resolve({ request }, args) {
    const { user } = request;
    if (!user) throw new NotLoggedInError();
    if (!user.isAdmin) throw new NoAccessError();
    return CjProblem.create({
      ...args,
    });
  },
};

const problems = {
  type: new List(CjProblemType),
  args: {
    ids: {
      description: 'ids of the problems',
      type: new List(StringType),
    },
  },
  resolve(obj, args) {
    const where = {};
    if (args.ids) {
      where.id = args.ids;
    }
    return CjProblem.findAll({ where });
  },
};

const updateProblem = {
  type: CjProblemType,
  args: {
    id: {
      description: 'id of the problem',
      type: new NonNull(StringType),
    },
    title: {
      description: 'The title of the problem',
      type: new NonNull(StringType),
    },
  },
  resolve(parent, { id, title }) {
    return CjProblem.findById(id).then(problem => problem.update({ title }));
  },
};

export { createProblem, problems, updateProblem };
