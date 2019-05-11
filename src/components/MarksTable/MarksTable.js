import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormControl, FormGroup, Table } from 'react-bootstrap';
import moment from 'moment';
// TODO: reuse it with html-to-react
import parse from 'html-react-parser';
import MarkdownIt from 'markdown-it';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './MarksTable.css';
import IconButton from '../IconButton/IconButton';
import { createMark } from '../../actions/units';
import User from '../User';
import { getRole } from '../../util/course';
import TextEditor from '../TextEditor';

class MarksTable extends Component {
  static propTypes = {
    answer: PropTypes.shape({
      id: PropTypes.string,
      marks: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          mark: PropTypes.number,
          comment: PropTypes.string,
          createdAt: PropTypes.string,
          author: PropTypes.shape({
            id: PropTypes.string,
            email: PropTypes.string,
          }),
        }),
      ),
    }).isRequired,
    course: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    createMark: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      mark: '0',
      comment: '',
    };
  }

  getValidationState() {
    const { mark } = this.state;
    if (mark < 0 || mark > 100) return 'error';
    else if (mark > 0) return 'success';
    return null;
  }

  handleSubmit = e => {
    e.preventDefault();
    const md = new MarkdownIt();
    this.props.createMark({
      ...this.state,
      comment: md.render(this.state.comment),
      answerId: this.props.answer.id,
    });
    this.setState({ comment: '', mark: 0 });
  };

  handleChange = name => ({ target: { value } }) =>
    this.setState({
      [name]: value,
    });

  render() {
    const { mark, comment } = this.state;
    const { answer, course, user } = this.props;
    const { marks = [] } = answer;

    const role = getRole(course, user);

    return (
      <Fragment>
        <h3>Marks list</h3>
        <form>
          <Table striped bordered responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Mark</th>
                <th>Comment</th>
                <th>Date</th>
                <th>By</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m, index) => (
                <tr key={m.id}>
                  <td>{index + 1}</td>
                  <td>{m.mark.toFixed(2)}</td>
                  <td>{parse(m.comment)}</td>
                  <td title={moment(m.createdAt).format('llll')}>
                    {moment(m.createdAt).fromNow()}
                  </td>
                  <td>
                    <User user={m.author} />
                  </td>
                </tr>
              ))}
              {!marks.length && (
                <tr>
                  <td colSpan="5">
                    <span>No marks yet</span>
                  </td>
                </tr>
              )}
              {(user.isAdmin || role === 'teacher') && (
                <tr>
                  <td />
                  <td className={s.markColumn}>
                    <FormGroup
                      bsClass="mb-0"
                      controlId="mark"
                      validationState={this.getValidationState()}
                    >
                      <FormControl
                        type="number"
                        width="100px"
                        min="0"
                        max="100"
                        step="10"
                        placeholder="Mark from 0 to 100"
                        value={mark}
                        onChange={this.handleChange('mark')}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                  </td>
                  <td colSpan="2">
                    <TextEditor
                      value={comment}
                      mode="markdown"
                      onChange={val => this.setState({ comment: val })}
                    />
                  </td>
                  <td>
                    <IconButton
                      disabled={this.getValidationState() === 'error'}
                      onClick={this.handleSubmit}
                      glyph="ok"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </form>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  answer: state.answer,
  user: state.user,
  course: state.course,
});

export default connect(
  mapStateToProps,
  { createMark },
)(withStyles(s)(MarksTable));
