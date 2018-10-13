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
import { connect } from 'react-redux';
import s from './Courses.css';
import ModalAdd from '../../components/ModalAdd';
import { createCourse, fetchCourses } from '../../actions/courses';
import CoursesList from '../../components/CoursesList';

class Courses extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    fetchCourses: PropTypes.func.isRequired,
    createCourse: PropTypes.func.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
    }),
    courses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
      }),
    ).isRequired,
  };

  static contextTypes = {
    store: PropTypes.any.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
    }),
  };

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      this.props.fetchCourses(user);
    }
  }

  render() {
    const { user, courses, title } = this.props;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {title}
            {user && <ModalAdd onUpdate={t => this.props.createCourse(t)} />}
          </h1>
          <CoursesList courses={courses} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  courses: state.courses || [],
  user: state.user,
});
export default connect(
  mapStateToProps,
  { createCourse, fetchCourses },
)(withStyles(s)(Courses));
