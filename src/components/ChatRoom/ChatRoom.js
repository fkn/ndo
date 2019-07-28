import React, { Component, Fragment } from 'react';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Form,
  Button,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import ChatTable from '../ChatTable';

class ChatRoomComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      message: '',
    };

    this.socket = io('http://localhost:3003');
  }

  componentDidMount() {
    this.socket.on('chat', message => {
      message.key = JSON.stringify(message);
      this.setState(({ messages }) => ({ messages: [...messages, message] }));
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  handleMessageChange = event => {
    this.setState({
      message: event.target.value,
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { name } = this.props;
    const { message } = this.state;
    this.socket.emit('chat', {
      name,
      message,
      timestamp: new Date().toISOString(),
    });
    this.setState({
      message: '',
    });
  };

  render() {
    const { message, messages } = this.state;
    return (
      <Fragment>
        <Form inline onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>Message</ControlLabel>{' '}
            <FormControl
              id="message"
              type="text"
              label="Message"
              placeholder="Enter your message"
              onChange={this.handleMessageChange}
              value={message}
              autoComplete="off"
            />
          </FormGroup>
          <Button type="submit">Send</Button>
        </Form>

        <ChatTable messages={messages} />
      </Fragment>
    );
  }
}

ChatRoomComponent.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ChatRoomComponent;
