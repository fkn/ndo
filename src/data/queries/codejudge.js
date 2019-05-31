import {
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';
import fetch from 'node-fetch';
import { NoAccessError, NotLoggedInError } from '../../errors';
import CjResponseType from '../types/CjResponseType';

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
      body: { source, lang },
    }).then(res => res.json());
  },
};

// eslint-disable-next-line import/prefer-default-export
export { createCjSubmission };
