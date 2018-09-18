import React from 'react';
import AnswerList from './AnswerList';

const EntityMarkList = EntityList => (
  <ol>
    {EntityList.map(entity => (
      <li>
        <AnswerList answers={entity.answers} stydyEntity={entity} />
      </li>
    ))}
  </ol>
);

export default EntityMarkList;
