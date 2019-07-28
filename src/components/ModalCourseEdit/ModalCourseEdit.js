import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FormControl,
  ControlLabel,
  FormGroup,
  HelpBlock,
  Tabs,
  Tab,
} from 'react-bootstrap';
import { updateCourse, createCourse } from '../../actions/courses';
import Modal from '../../components/Modal';
import TextEditor from '../../components/TextEditor';

class ModalCourseEdit extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    modalId: PropTypes.string.isRequired,
    course: PropTypes.shape({}),
    edit: PropTypes.bool,
  };

  static defaultProps = {
    edit: true,
    course: {},
  };

  state = {};

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { course, edit, modalId, dispatch } = this.props;
    const {
      title = course.title,
      tab = 'course',
      schema = course.schema || '',
    } = this.state;
    return (
      <Modal
        modalId={modalId}
        defaultFooter={edit ? 'save_close' : 'add_close'}
        onSubmit={() =>
          dispatch(
            edit
              ? updateCourse({ title, schema })
              : createCourse({ title, schema }),
          )
        }
      >
        <Modal.Body>
          <Tabs activeKey={tab} onSelect={key => this.setState({ tab: key })}>
            <Tab eventKey="course" title="Course">
              <FormGroup controlId="title">
                <ControlLabel>Title</ControlLabel>
                <FormControl
                  autoFocus
                  type="text"
                  name="title"
                  value={title}
                  onChange={this.handleChange}
                />
                <HelpBlock>Title can not be empty</HelpBlock>
              </FormGroup>
            </Tab>
            <Tab eventKey="schema" title="Schema">
              <TextEditor
                mode="json"
                value={schema}
                onChange={value => this.setState({ schema: value })}
              />
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  course: state.course,
});

export default connect(mapStateToProps)(ModalCourseEdit);
