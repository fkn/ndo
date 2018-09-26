import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

const AnswerList = ({ studyEntity }) => (
  <Table>
    <thead>
      <tr>
        <th scope="col">{studyEntity.title}</th>
        <th scope="col">Mark</th>
      </tr>
      {studyEntity.answers[0].marks.map(mark => (
        <tr>
          <td>{mark.createdAt.substr(0, 10) || 'No'}</td>
          <td>{mark.mark.toFixed(2) || 'No'}</td>
        </tr>
      ))}
    </thead>
  </Table>
);
AnswerList.propTypes = {
  studyEntity: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        marks: PropTypes.arrayOf(
          PropTypes.shape({
            createdAt: PropTypes.string,
            id: PropTypes.string,
            mark: PropTypes.float,
          }),
        ),
      }),
    ),
  }).isRequired,
};

export default AnswerList;
