import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Button } from 'react-bootstrap';
import MarksTable from '../../components/MarksTable';
import createAnswer from '../../gql/createAnswer.gql';

class AnswerSave extends React.Component {
  state = {};

  /**
   * Prepare data for sending
   * @returns {Object} object with body and data fields, where body - Object
   * with answer, data - additional FormData to be sent
   */
  prepareAnswer() {
    const { body } = this.props.answer;
    const files = Object.entries(body).filter(
      ans => ans[1] instanceof window.File,
    );
    const uploadOrder = [];
    const data = [];
    files.forEach(file => {
      uploadOrder.push(file[0]);
      data.push(['upload', file[1]]);
      delete body[file[0]];
    });
    data.unshift(['upload_order', JSON.stringify(uploadOrder)]);
    return { body, data };
  }

  /**
   * Sends prepared data
   * @param {string} query - query for GraphQL (create or update)
   * @param {Object} answer - body of the answer
   * @param {Object} variables - additional varibales for query
   */
  sendAnswer(query, answer, variables) {
    const body = new FormData();
    body.append('query', query);
    body.append(
      'variables',
      JSON.stringify({ ...variables, body: JSON.stringify(answer.body) }),
    );
    answer.data.forEach(d => body.append(d[0], d[1]));
    return this.context.fetch('/graphql', { body });
  }

  /**
   * Generates and sends FormData to the server. Expects that
   * this.props.answers contains Object with fields, some of them may be File
   */
  saveAnswer = async () => {
    const { course, unit } = this.props;
    this.setState({ isSaving: true });
    const answer = this.prepareAnswer();
    try {
      await this.sendAnswer(
        // TODO: decide if we want answer update
        createAnswer,
        answer,
        { courseId: course.id, unitId: unit.id },
      );
      this.setState({
        status: 'success',
        message: 'save completed successfully',
      });
    } catch (e) {
      this.setState({ status: 'danger', message: 'save error' });
    } finally {
      this.setState({ isSaving: false });
    }
  };

  addEmptyAnswer = async () => {
    const { course, unit, answerUser } = this.props;
    await this.sendAnswer(
      createAnswer,
      { body: {}, data: [['upload_order', '[]']] },
      { courseId: course.id, unitId: unit.id, userId: answerUser.id },
    );
  };

  render() {
    const { answerUser, answer, user, role } = this.props;
    const { status, message, isSaving } = this.state;
    return (
      <React.Fragment>
        {answerUser && (
          <Button onClick={this.saveAnswer} disabled={isSaving}>
            Save
          </Button>
        )}
        {status && <Alert variant={status}>{message}</Alert>}
        {answer ? (
          <MarksTable />
        ) : (
          <p>
            This unit has no answers yet
            {role === 'teacher' &&
              user && (
                <Button size="sm" onClick={this.addEmptyAnswer}>
                  Add empty answer
                </Button>
              )}
          </p>
        )}
      </React.Fragment>
    );
  }
}

AnswerSave.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  role: PropTypes.string.isRequired,
  answerUser: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  answer: PropTypes.shape({
    id: PropTypes.string,
    body: PropTypes.any,
  }).isRequired,
};

AnswerSave.contextTypes = {
  fetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  course: state.course,
  unit: state.unit,
  user: state.user,
  answer: state.answer,
  answerUser: state.answerUser,
});

export default connect(mapStateToProps)(AnswerSave);
