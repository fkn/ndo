import React from 'react';
import PropTypes from 'prop-types';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import UnitView from '../../components/UnitView';
import { setAnswer, setAnswerBody } from '../../actions/units';
import { setSecondMenu } from '../../actions/menu';
import retrieveAnswerQuery from '../../gql/retrieveAnswer.gql';
import s from './Unit.css';
import Link from '../../components/Link/Link';
import ModalUnitEdit from '../../components/ModalUnitEdit';
import { showModal } from '../../actions/modals';
import IconButton from '../../components/IconButton';
import AnswerSave from './AnswerSave';

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
      body: PropTypes.shape,
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

  static getAnswersByUser(answers, userId) {
    const data = {};
    answers.forEach(answer => {
      const { id } = answer.user;
      const ua = data[id] || { user: answer.user, answers: [] };
      data[id] = ua;
      ua.answers.push(answer);
    });
    return {
      users: Object.values(data).map(d => ({
        ...d.user,
        needMark: d.answers.some(ans => !ans.marks.length),
      })),
      answers: (data[userId] || { answers: [] }).answers.map(ans => ({
        ...ans,
        needMark: !ans.marks.length,
      })),
    };
  }

  static sortUsers(a, b) {
    const name1 = a.profile.displayName;
    const name2 = b.profile.displayName;
    return name1.localeCompare(name2);
  }

  constructor(props) {
    super(props);
    this.state = {
      answerCur: 0,
      answers: [],
    };
  }

  async componentDidMount() {
    const { user } = this.props;
    if (user) {
      await this.retrieveAnswer();
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(setSecondMenu('unit', []));
  }

  handleChange = name => ({ target: { value } }) =>
    this.setState({
      [name]: value,
    });

  handleUserSelect = id => {
    const userCur = id;
    this.setState({ userCur, answerCur: undefined });
  };

  handleAnswerSelect = id => {
    const answerCur = id;
    this.setState({ answerCur });
    this.props.dispatch(
      setAnswer(this.state.answers.find(ans => ans.id === answerCur)),
    );
  };

  async retrieveAnswer() {
    const { user, course, unit } = this.props;
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: retrieveAnswerQuery,
        variables: {
          userIds: (!user.isAdmin && [user.id]) || null,
          unitIds: [unit.id],
          courseIds: [course.id],
        },
      }),
    });
    const { data } = await resp.json();
    const { answers = [] } = data.courses[0].units[0];
    if (answers && answers.length) {
      this.setState({
        answers: answers.map(answer => {
          const ans = answer;
          ans.body = JSON.parse(answer.body);
          return ans;
        }),
      });
    }
    this.props.dispatch(setAnswer(answers[0] || { body: {} }));
  }

  render() {
    const { user = {}, role, unit, course, dispatch } = this.props;
    const { answers = [], userCur = user.id } = this.state;
    let { answerCur } = this.state;
    const ua = Unit.getAnswersByUser(answers, userCur);
    const uids = ua.users.map(u => u.id);
    ua.users.sort(Unit.sortUsers);
    const users = ua.users.concat(
      course.users.filter(u => !uids.includes(u.id)).sort(Unit.sortUsers),
    );
    if (!answerCur) answerCur = (ua.answers[ua.answers.length - 1] || {}).id;
    const answerUser = users.find(u => u.id === userCur);
    const answer = answers.find(ans => ans.id === answerCur);
    return (
      <div className={s.root}>
        <ModalUnitEdit modalId="modalUnitEdit" />
        <div className={s.container}>
          <h1>
            <Link to={`/courses/${course.id}`}>{course.title}</Link>
            {`/${unit.title}`}
            {role === 'teacher' && (
              <IconButton
                onClick={() => dispatch(showModal('modalUnitEdit'))}
                glyph="pencil"
              />
            )}
            {unit.answerable && (
              <React.Fragment>
                {(role === 'teacher' || user.isAdmin) && (
                  <DropdownButton
                    id="user_chooser"
                    title={
                      (answerUser && answerUser.profile.displayName) || 'User'
                    }
                    onSelect={this.handleUserSelect}
                  >
                    {users.map(u => (
                      <MenuItem
                        key={u.id}
                        eventKey={u.id}
                        active={u.id === userCur}
                        className={u.needMark && s['need-mark']}
                      >
                        {u.profile.displayName}
                      </MenuItem>
                    ))}
                  </DropdownButton>
                )}
                <DropdownButton
                  id="answer_chooser"
                  title={(answer && answer.createdAt) || 'Answer'}
                  onSelect={this.handleAnswerSelect}
                >
                  {ua.answers.map(ans => (
                    <MenuItem
                      key={ans.id}
                      eventKey={ans.id}
                      active={ans.id === answerCur}
                      className={ans.needMark && s['need-mark']}
                    >
                      {ans.createdAt}
                    </MenuItem>
                  ))}
                </DropdownButton>
              </React.Fragment>
            )}
          </h1>
          <UnitView
            answerId={this.props.answer.id}
            value={this.props.answer.body}
            body={unit.body}
            onChange={val => this.props.dispatch(setAnswerBody(val))}
            onHeadersChange={headers =>
              dispatch(
                setSecondMenu('unit', headers.filter(item => item.level === 2)),
              )
            }
          />
          {unit.answerable && (
            <AnswerSave
              course={course}
              unit={unit}
              user={user}
              answer={this.props.answer}
              answerUser={answerUser}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  unit: state.unit,
  user: state.user,
  answer: state.answer,
});

export default connect(mapStateToProps)(withStyles(s)(Unit));
