import {
  SET_UNIT_HEADERS,
  ADD_MARK,
  SET_ANSWER,
  SET_ANSWER_BODY,
  ADD_UNIT,
  SET_UNIT,
  UPDATE_UNIT,
  SET_ANSWER_USER,
} from '../constants';
import createMarkGql from '../gql/createMark.gql';
import loadAnswerGql from '../gql/loadAnswer.gql';
import createUnitGql from '../gql/createUnit.gql';
import updateUnitGql from '../gql/updateUnit.gql';

export function setUnitHeaders(headers) {
  return {
    type: SET_UNIT_HEADERS,
    data: headers,
  };
}

export function addMark(mark) {
  return {
    type: ADD_MARK,
    data: mark,
  };
}

export function setAnswer(answer) {
  return {
    type: SET_ANSWER,
    data: answer,
  };
}

export function setAnswerBody(body) {
  return {
    type: SET_ANSWER_BODY,
    data: body,
  };
}

export function setAnswerUser(user) {
  return {
    type: SET_ANSWER_USER,
    data: user,
  };
}

export function createMark(mark) {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest(createMarkGql, mark);
    return dispatch(addMark(data.createMark));
  };
}

export function loadAnswer(id) {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest(loadAnswerGql, { id });
    return dispatch(setAnswer(data.answers[0]));
  };
}

export function createUnit(unit) {
  return {
    type: ADD_UNIT,
    data: unit,
  };
}

export function setUnit(unit) {
  return {
    type: SET_UNIT,
    data: unit,
  };
}

export function editUnit(unit) {
  return {
    type: UPDATE_UNIT,
    data: unit,
  };
}

export function addUnit(unit) {
  return async (dispatch, getState, { graphqlRequest }) => {
    const { id } = getState().course;
    const { data } = await graphqlRequest(createUnitGql, { ...unit, id });
    return dispatch(createUnit(data.createUnit));
  };
}

export function updateUnit(unit) {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest(updateUnitGql, unit);
    return dispatch(editUnit(data.updateUnit));
  };
}
