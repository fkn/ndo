import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import ChatRoom from '../../components/ChatRoom';

const Home = ({ user }) => (
  <div className={s.root}>
    <div className={s.container}>
      <h1>NDO</h1>
      <ChatRoom name={user ? user.email : ''} />
    </div>
  </div>
);

Home.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }),
};

Home.defaultProps = {
  user: null,
};

export default withStyles(s)(Home);
