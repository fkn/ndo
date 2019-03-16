import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Link from '../Link';

const User = ({ user, link, hideTags }) => {
  const tags = [];
  if (!user) tags.push('robot');
  if (user && user.isAdmin) tags.push('admin');
  if (user && user.role) tags.push(user.role);
  const tagsView = (tags.length && <b>[{tags.join(', ')}]</b>) || null;
  const name = _.get(user, 'profile.displayName') || _.get(user, 'email') || '';
  return user && link ? (
    <span>
      <Link to={`/users/${user.id}`}>{name}</Link>
      {!hideTags && tagsView}
    </span>
  ) : (
    <span>
      {name}
      {!hideTags && tagsView}
    </span>
  );
};

User.defaultProps = {
  link: true,
  hideTags: false,
};

User.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool,
    role: PropTypes.string,
  }).isRequired,
  link: PropTypes.bool,
  hideTags: PropTypes.bool,
};

export default User;
