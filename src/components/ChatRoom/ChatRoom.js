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

class ChatRoom extends Component {
  state = {
    messages: [],
    message: '',
  };

  componentDidMount() {
    this.socket.on('chat', message => {
      message.key = JSON.stringify(message);
      this.setState(({ messages }) => ({ messages: [...messages, message] }));
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  socket = io('http://localhost:3003');

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

ChatRoom.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ChatRoom;
