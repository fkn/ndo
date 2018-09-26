import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const AnswerList = ({ studyEntity }) => (
  <Table>
    <thead>
      <tr>
        <th scope="col">{studyEntity.title}</th>
        <th>Date</th>
<<<<<<< HEAD
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
=======
>>>>>>> markset
const AnswerList = ({ answers, stydyEntity }) => (
=======
const AnswerList = ({ studyEntity }) => (
>>>>>>> add MarksList
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
<<<<<<< HEAD
>>>>>>> markset
=======
>>>>>>> markset
=======
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
>>>>>>> fix Mark-list
    </thead>
  </Table>
);
AnswerList.propTypes = {
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
>>>>>>> markset
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
<<<<<<< HEAD
>>>>>>> markset
=======
>>>>>>> markset
=======
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
>>>>>>> add MarksList
      }),
    ),
  }).isRequired,
};

export default AnswerList;
