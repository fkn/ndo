import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link/Link';

// ugly temp solution
function sortBySchema(units, schema) {
  if (!schema) return units;
  try {
    schema = JSON.parse(schema);
  } catch (e) {
    return units;
  }
  const { deps = [] } = schema;
  const res = [];
  deps.forEach(dinfo => {
    const unitFrom = units.find(u => u.id === dinfo.from);
    const unitTo = units.find(u => u.id === dinfo.to);
    const indexFrom = res.findIndex(u => u.id === dinfo.from);
    const indexTo = res.findIndex(u => u.id === dinfo.to);
    if (indexFrom < 0 && indexTo < 0) return res.push(unitFrom, unitTo);
    if (indexFrom >= 0 && indexTo >= 0) return 0;
    return res.splice(Math.max(indexFrom, indexTo), 1, unitFrom, unitTo);
  });
  return res;
}

const UnitsList = ({ courseId, units, role, schema }) => (
  <ol>
    {sortBySchema(units, schema).map(({ id, title }) => (
      <li key={id}>
        {['student', 'teacher'].includes(role) ? (
          <Link to={`/courses/${courseId}/${id}`}>{title}</Link>
        ) : (
          <span>{title}</span>
        )}
      </li>
    ))}
  </ol>
);

UnitsList.propTypes = {
  units: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  role: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  schema: PropTypes.string,
};

UnitsList.defaultProps = {
  schema: '',
};

export default UnitsList;
