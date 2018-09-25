/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Row, Col } from 'react-bootstrap';
import s from './CourseUsers.css';

class CourseUsers extends React.Component {
  static propTypes = {
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      users: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
        }),
      ),
    }).isRequired,
  };

  static contextTypes = {
    store: PropTypes.any.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  render() {
    const usersList = [];
    const { users } = this.props.course;
    for (let i = 0; i < users.length; i += 1) {
      usersList.push(
        <li key={users[i].id}>
          <a href={`/users/${users[i].id}`}>{users[i].email}</a> (
          {users[i].role})
        </li>,
      );
    }
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Row>
            <h2>Subscribed to {this.props.course.title}:</h2>
            <Col xs={12} md={10}>
              <ol>{usersList}</ol>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(CourseUsers);
