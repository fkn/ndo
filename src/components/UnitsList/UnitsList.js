import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cn from 'classnames';
import Link from '../Link/Link';
import s from './UnitsList.css';

// ugly temp solution
function sortBySchema(units, schema) {
  if (!schema) return units;
  try {
    schema = JSON.parse(schema);
  } catch (e) {
    return units;
  }
  const { deps = [] } = schema;
  let res = [];
  deps.forEach(dinfo => {
    const unitFrom = units.find(u => u.id === dinfo.from);
    const unitTo = units.find(u => u.id === dinfo.to);
    const indexFrom = res.findIndex(u => u.id === dinfo.from);
    const indexTo = res.findIndex(u => u.id === dinfo.to);
    if (indexFrom < 0 && indexTo < 0) return res.push(unitFrom, unitTo);
    if (indexFrom >= 0 && indexTo >= 0) return 0;
    return res.splice(Math.max(indexFrom, indexTo), 1, unitFrom, unitTo);
  });
  const resIds = res.map(u => u.id);
  res = res.concat(
    units
      .filter(u => !resIds.includes(u.id))
      .map(u => ({ ...u, nonSchema: true })),
  );
  return res;
}

const UnitsList = ({ courseId, units, role, schema }) => (
  <ol>
    {sortBySchema(units, schema).map(({ id, title, nonSchema, answerable }) => (
      <li
        key={id}
        className={cn(
          nonSchema && s.nonSchema,
          answerable ? s.answerable : s.nonAnswerable,
        )}
      >
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

export default withStyles(s)(UnitsList);
