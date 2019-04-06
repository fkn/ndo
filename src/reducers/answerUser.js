import _ from 'lodash';
import { SET_ANSWER_USER, SET_COURSE } from '../constants';

export default function answer(state = {}, action) {
  switch (action.type) {
    case SET_ANSWER_USER:
      return action.data;
    case SET_COURSE:
      return _.get(action.data, 'users[0]') || state;
    default:
      return state;
  }
}
