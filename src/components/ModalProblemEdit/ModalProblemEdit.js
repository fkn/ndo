import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import Modal from '../../components/Modal';
import createProblemMutation from '../../gql/createProblem.gql';

class ModalProblemEdit extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    userId: PropTypes.string,
    edit: PropTypes.bool,
  };

  static defaultProps = {
    userId: null,
    edit: false,
  };

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  };

  state = { title: '' };

  handleSubmit = async () => {
    const { title } = this.state;
    try {
      await this.context.fetch('/graphql', {
        body: JSON.stringify({
          query: createProblemMutation,
          variables: {
            title,
          },
        }),
      });
    } catch (error) {
      throw error;
    }
    this.setState({ title: '' });
  };

  handleChange = event => {
    this.setState({ title: event.target.value });
  };

  render() {
    const { title } = this.state;
    const { userId, dispatch, ...rest } = this.props;

    return (
      <Modal {...rest} onSubmit={this.handleSubmit}>
        <Modal.Body>
          <Form>
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
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.user && state.user.id,
});

export default connect(mapStateToProps)(ModalProblemEdit);
