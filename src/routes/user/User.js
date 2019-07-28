import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Button,
  FormControl,
  Row,
  Col,
  FormGroup,
  ControlLabel,
} from 'react-bootstrap';
import { showModal } from '../../actions/modals';
import s from './User.css';
import Modal from '../../components/Modal';
import CoursesList from '../../components/CoursesList/CoursesList';

class User extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      profile: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
        picture: PropTypes.string.isRequired,
      }).isRequired,
      courses: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }).isRequired,
  };
  state = {
    password: '',
    confirmPassword: '',
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = () => {
    // TODO: implement password update logic
  };

  render() {
    const { title, user, dispatch } = this.props;
    const { password, confirmPassword } = this.state;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Row>
            <Col xs={12} md={3}>
              <h1>
                {title} {user.profile.displayName}
              </h1>
              <p>Gender: {user.profile.gender}</p>
              <p>E-mail: {user.email}</p>
              <Button
                bsStyle="primary"
                onClick={() => dispatch(showModal('modalPasswordUpdate'))}
              >
                Change password
              </Button>
            </Col>
            <Col xs={12} md={2}>
              <img
                className={s.picture}
                src={user.profile.picture}
                alt="Profile"
              />
            </Col>
          </Row>
          <Row>
            <h2>Courses</h2>
            <Col xs={12} md={4}>
              <CoursesList courses={user.courses} />
            </Col>
          </Row>
          <Modal
            defaultFooter="save_close"
            onSubmit={this.handleSubmit}
            modalId="modalPasswordUpdate"
          >
            <Modal.Body>
              <FormGroup>
                <ControlLabel>New password</ControlLabel>
                <FormControl
                  type="password"
                  name="password"
                  required
                  autoComplete="off"
                  minLength={6}
                  value={password}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Confirm password</ControlLabel>
                <FormControl
                  type="password"
                  name="confirmPassword"
                  autoComplete="off"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
}

export default connect()(withStyles(s)(User));
