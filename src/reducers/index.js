import { combineReducers } from 'redux';
import user from './user';
import courses from './courses';
import course from './course';
import unit from './unit';
import users from './users';
import files from './files';
import groups from './groups';
import answer from './answer';
import secondMenu from './menu';

export default combineReducers({
  user,
  courses,
  course,
  unit,
  users,
  files,
  groups,
  answer,
  secondMenu,
});
