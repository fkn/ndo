import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import MarksTable from '../../components/MarksTable';
import UnitView from '../../components/UnitView';
import { setAnswer, setAnswerBody } from '../../actions/units';
import { setSecondMenu } from '../../actions/menu';
import updateAnswer from '../../gql/updateAnswer.gql';
import createAnswer from '../../gql/createAnswer.gql';
import retrieveAnswerQuery from '../../gql/retrieveAnswer.gql';
import s from './Unit.css';
import Link from '../../components/Link/Link';
import ModalUnitEdit from '../../components/ModalUnitEdit';
import { showModal } from '../../actions/modals';
import IconButton from '../../components/IconButton';

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

  constructor(props) {
    super(props);
    this.state = {
      answerCur: 0,
      answers: [],
      isSaving: false,
      saveStatus: '',
      saveMassage: '',
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

  handleAnswerSelect = eventKey => {
    const answerCur = parseInt(eventKey, 10);
    this.setState({ answerCur });
    this.props.dispatch(setAnswer(this.state.answers[answerCur]));
  };

  async uploadFile(key, file) {
    const { user } = this.props;
    const formData = new FormData();
    formData.append(
      'query',
      `mutation uploadFile($internalName: String!, $userId: String!) {
        uploadFile(internalName: $internalName, userId: $userId) { id }
      }`,
    );
    formData.append(
      'variables',
      JSON.stringify({
        userId: user.id,
        internalName: file.name,
      }),
    );
    formData.append('file', file);
    const res = await this.context.fetch('/graphql', {
      body: formData,
    });
    const { data, errors } = await res.json();
    if (errors && errors.length) throw new Error(errors);
    return { key, data: { type: 'file', id: data.uploadFile.id } };
  }

  async postProcessAnswer(answer) {
    const res = { ...answer };
    const files = Object.entries(answer).filter(
      ans => ans[1] instanceof window.File,
    );
    const tasks = [];
    for (let i = 0; i < files.length; i += 1) {
      tasks.push(this.uploadFile(files[i][0], files[i][1]));
    }
    const filesData = await Promise.all(tasks);
    filesData.forEach(fd => {
      res[fd.key] = fd.data;
    });
    return res;
  }

  saveAnswer = async () => {
    const { course, unit } = this.props;
    this.setState({ isSaving: true });
    const answer = await this.postProcessAnswer(this.props.answer.body);
    try {
      if (this.props.answer.id) {
        await this.context.fetch('/graphql', {
          body: JSON.stringify({
            query: updateAnswer,
            variables: {
              body: JSON.stringify(answer),
              id: this.props.answer.id,
            },
          }),
        });
      } else {
        await this.context.fetch('/graphql', {
          body: JSON.stringify({
            query: createAnswer,
            variables: {
              body: JSON.stringify(answer),
              courseId: course.id,
              unitId: unit.id,
            },
          }),
        });
      }
      this.setState({
        saveStatus: 'success',
        saveMassage: 'save completed successfully',
      });
    } catch (e) {
      this.setState({ saveStatus: 'danger', saveMassage: 'save error' });
    } finally {
      this.setState({ isSaving: false });
    }
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
    const { answers = [], answerCur, saveStatus, saveMassage } = this.state;
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
            {(role === 'teacher' || user.isAdmin) &&
              answers[answerCur] && (
                <DropdownButton
                  id="answer_chooser"
                  title={`${answers[answerCur].user.profile.displayName} ${
                    answers[answerCur].createdAt
                  }`}
                  onSelect={this.handleAnswerSelect}
                >
                  {user.isAdmin &&
                    answers.map((ans, i) => (
                      <MenuItem
                        key={ans.id}
                        eventKey={i}
                        active={i === answerCur}
                      >
                        {`
                      ${ans.user.profile.displayName}
                      ${ans.createdAt}`}
                      </MenuItem>
                    ))}
                </DropdownButton>
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
          {user && (
            <Button onClick={this.saveAnswer} disabled={this.state.isSaving}>
              Save
            </Button>
          )}
          {saveStatus && <Alert variant={saveStatus}>{saveMassage}</Alert>}
          {unit.answers[0] ? (
            <MarksTable />
          ) : (
            <p>This unit has no answers yet</p>
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
