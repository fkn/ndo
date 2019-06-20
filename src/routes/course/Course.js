import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import UnitsList from '../../components/UnitsList';
import s from './Course.css';
import { showModal } from '../../actions/modals';
import IconButton from '../../components/IconButton';
import ModalCourseEdit from '../../components/ModalCourseEdit';
import ModalUnitEdit from '../../components/ModalUnitEdit';
import { getRole } from '../../util/course';

function Course({ user, course, dispatch }) {
  const { units, id, title, schema } = course;
  const role = getRole(course, user);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>
          {title}
          {user.isAdmin && (
            <Fragment>
              <IconButton
                onClick={() => dispatch(showModal('modalCourseEdit'))}
                glyph="pencil"
              />
              <ModalCourseEdit modalId="modalCourseEdit" />
            </Fragment>
          )}

          {role === 'teacher' && (
            <Fragment>
              <IconButton
                onClick={() => dispatch(showModal('modalUnitAdd'))}
                glyph="plus"
              />
              <ModalUnitEdit modalId="modalUnitAdd" edit={false} />
            </Fragment>
          )}
        </h1>
        <UnitsList units={units} courseId={id} role={role} schema={schema} />
      </div>
    </div>
  );
}

Course.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  course: PropTypes.shape({
    units: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
      }),
    ),
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    schema: PropTypes.string,
  }).isRequired,
};

Course.contextTypes = {
  fetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  course: state.course,
  user: state.user || {},
});

export default connect(mapStateToProps)(withStyles(s)(Course));
