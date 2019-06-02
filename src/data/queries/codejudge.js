import {
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';
import fetch from 'node-fetch';
import { NoAccessError, NotLoggedInError } from '../../errors';
import CjResponseType from '../types/CjResponseType';
import CjTest from '../models/CjTest';
import CjTestType from '../types/CjTestType';

const createCjTest = {
  type: CjTestType,
  args: {
    input: {
      description: 'Input data',
      type: new NonNull(StringType),
    },
    output: {
      description: 'Output data',
      type: new NonNull(StringType),
    },
  },
  resolve({ request }, { input, output }) {
    const { user } = request;
    if (!user) throw new NotLoggedInError();
    if (!user.isAdmin) throw new NoAccessError();
    return fetch('http://localhost:5000/tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, output }),
    })
      .then(res => res.json())
      .then(({ id }) =>
        CjTest.create({
          idCj: id,
        }),
      )
      .catch(err => err);
  },
};

const createCjSubmission = {
  type: CjResponseType,
  args: {
    source: {
      description: 'Source code of the submissinon',
      type: new NonNull(StringType),
    },
    lang: {
      description: 'Programming language',
      type: new NonNull(StringType),
    },
  },
  async resolve({ request }, { source, lang }) {
    const { user } = request;
    if (!user) throw new NotLoggedInError();
    if (!user.isAdmin) throw new NoAccessError();
    return fetch('http://localhost:5000/solutions', {
      method: 'POST',
      body: JSON.stringify({ source, lang }),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
  },
};

const deleteCjTest = {
  type: CjTestType,
  args: {
    id: {
      description: 'Id of the test to delete',
      type: new NonNull(StringType),
    },
  },
  resolve({ request }, args) {
    const { user } = request;
    if (!user) throw new NotLoggedInError();
    if (!user.isAdmin) throw new NoAccessError();
    const where = { id: args.id };
    return CjTest.destroy({ where });
  },
};

const createCjRun = {
  type: CjResponseType,
  args: {
    test: {
      description: 'Id of the test',
      type: new NonNull(StringType),
    },
    solution: {
      description: 'Id of the solution',
      type: new NonNull(StringType),
    },
  },
  async resolve({ request }, { test, solution }) {
    const { user } = request;
    if (!user) throw new NotLoggedInError();
    if (!user.isAdmin) throw new NoAccessError();
    return fetch(
      `http://localhost:5000/runs?solution=${solution}&test=${test}`,
      {
        method: 'POST',
      },
    ).then(res => res.json());
  },
};

export { createCjSubmission, createCjRun, createCjTest, deleteCjTest };