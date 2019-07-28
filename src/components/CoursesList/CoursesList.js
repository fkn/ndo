import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';

const CoursesList = ({ courses = [] }) => (
  <ol>
    {courses.map(({ id, title }) => (
      <li key={id}>
        <Link to={`/courses/${id}`}>{title}</Link>
      </li>
    ))}
  </ol>
);

CoursesList.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default CoursesList;
