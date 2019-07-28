import React from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ChatTable = ({ messages = [] }) => (
  <Table striped hover>
    <tbody>
      {messages.map(message => (
        <tr key={message.key}>
          <td className="name-column">{message.name}</td>
          <td>{message.message}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

ChatTable.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default ChatTable;
