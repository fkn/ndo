import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import UnitView from '../../components/UnitView';
import { setAnswerBody, setAnswerUser } from '../../actions/units';
import { setSecondMenu } from '../../actions/menu';
import s from './Unit.css';
import Link from '../../components/Link/Link';
import ModalUnitEdit from '../../components/ModalUnitEdit';
import { showModal } from '../../actions/modals';
import IconButton from '../../components/IconButton';
import AnswerSave from './AnswerSave';
import AnswerSelect from './AnswerSelect';

class Unit extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    role: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
    }),
    unit: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string,
    }).isRequired,
    answer: PropTypes.shape({
      id: PropTypes.string,
      body: PropTypes.any,
    }).isRequired,
    answerUser: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
    }).isRequired,
  };

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
    }),
  };

  componentDidMount() {
    const { role, user } = this.props;
    if (role !== 'teacher' && !user.isAdmin)
      this.props.dispatch(setAnswerUser(user));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(setSecondMenu('unit', []));
  }

  render() {
    const { role, unit, course, dispatch, answer } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            <Link to={`/courses/${course.id}`}>{course.title}</Link>
            {`/${unit.title}`}
            {role === 'teacher' && (
              <Fragment>
                <IconButton
                  onClick={() => dispatch(showModal('modalUnitEdit'))}
                  glyph="pencil"
                />
                <ModalUnitEdit modalId="modalUnitEdit" />
              </Fragment>
            )}
            {unit.answerable && <AnswerSelect role={role} />}
          </h1>
          <UnitView
            answerId={answer.id}
            value={answer.body || {}}
            body={unit.body}
            onChange={val => dispatch(setAnswerBody(val))}
            onHeadersChange={headers =>
              dispatch(
                setSecondMenu('unit', headers.filter(item => item.level === 2)),
              )
            }
          />
          {unit.answerable && <AnswerSave role={role} />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  unit: state.unit,
  answer: state.answer,
  answerUser: state.answerUser,
});

export default connect(mapStateToProps)(withStyles(s)(Unit));
