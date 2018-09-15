import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

<<<<<<< HEAD
const AnswerList = ({ studyEntity }) => (
  <Table>
    <thead>
      <tr>
        <th scope="col">{studyEntity.title}</th>
        <th>Date</th>
        <th scope="col">Mark</th>
      </tr>
      {studyEntity.answers[0] !== undefined ? (
        studyEntity.answers[0].marks.map(mark => (
          <tr>
            <td>NameAnswer</td>
            <td>{mark.createdAt.substr(0, 10) || 'No'}</td>
            <td>{mark.mark.toFixed(2) || 'No'}</td>
          </tr>
        ))
      ) : (
        <tr>not mark</tr>
      )}
=======
const AnswerList = ({ answers, stydyEntity }) => (
  <Table>
    <thead>
      <tr>
        <th scope="col">{stydyEntity.title}</th>
        <th scope="col">Deadline</th>
        <th scope="col">Mark</th>
      </tr>
      {answers.map(ans => (
        <tr>
          <td>{ans.title}</td>
          <td>{ans.deadline}</td>
          <td>{ans.mark}</td>
        </tr>
      ))}
>>>>>>> markset
    </thead>
  </Table>
);
AnswerList.propTypes = {
<<<<<<< HEAD
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
=======
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  stydyEntity: PropTypes.shape({
    title: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
>>>>>>> markset
      }),
    ),
  }).isRequired,
};

export default AnswerList;
