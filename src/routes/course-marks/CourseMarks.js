/* eslint-disable no-restricted-syntax */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FormGroup, Checkbox } from 'react-bootstrap';
import s from './CourseMarks.css';
import { UnitPropType } from './AnswerList';
import User from '../../components/User/User';
import Link from '../../components/Link/Link';
import ScrollableTable from '../../components/ScrollableTable/ScrollableTable';

function getLatestMark(answers) {
  function getMark(marks) {
    if (!marks || !marks.length) return undefined;
    return marks.reduce((mark, m) => {
      if (new Date(m.createdAt) - new Date(mark.createdAt) > 0) return m;
      return mark;
    });
  }
  if (!answers || !answers.length) return undefined;
  return (answers || [])
    .map(a => ({ answer: a, mark: getMark(a.marks) }))
    .reduce((res, am) => {
      if (!res.mark) return am;
      if (new Date(am.answer.updatedAt) - new Date(res.answer.updatedAt) > 0)
        return {
          answer: am.answer,
          mark: am.mark || res.mark,
          noMark: !am.mark,
        };
      return res;
    });
}

function buildCells(units) {
  const m = new Map();
  for (const unit of units) {
    for (const answer of unit.answers) {
      const id = `${unit.id} ${answer.user.id}`;
      const a = m.get(id) || [];
      a.push(answer);
      m.set(id, a);
    }
  }
  return m;
}

class UserMarks extends React.Component {
  static propTypes = {
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      units: PropTypes.arrayOf(UnitPropType),
      users: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          email: PropTypes.string,
        }),
      ),
    }).isRequired,
  };

  static sortUsers(a, b) {
    const name1 = a.profile.displayName;
    const name2 = b.profile.displayName;
    return name1.localeCompare(name2);
  }

  static sortUnits(a, b) {
    return a.title.localeCompare(b.title);
  }

  state = {};

  renderHeader1 = val => <User key={val.id} user={val} hideTags />;

  renderHeader2 = val => {
    const { id, title } = val;
    return <Link to={`/courses/${this.props.course.id}/${id}`}>{title}</Link>;
  };

  renderCell = (val, id) => {
    const { mark, answer, noMark } = getLatestMark(val) || {};
    const tags = [s.mark];
    if (!answer) tags.push(s.noAnswer);
    if (!mark || noMark) tags.push(s.noMark);
    return (
      <td key={id} className={tags.join(' ')}>
        {mark && Math.floor(mark.mark)}
      </td>
    );
  };

  render() {
    const { units, users, title } = this.props.course;
    const { transpose } = this.state;
    const visUsers = users
      .filter(u => u.role === 'student')
      .sort(UserMarks.sortUsers);
    const visUnits = units.filter(u => u.answerable).sort(UserMarks.sortUnits);
    const cells = buildCells(visUnits);
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Marks of {title}</h1>
          <ScrollableTable
            transpose={transpose}
            data1={visUsers}
            renderHeader1={this.renderHeader1}
            data2={visUnits}
            renderHeader2={this.renderHeader2}
            dataCells={cells}
            renderCell={this.renderCell}
          />
          <FormGroup controlId="transpose">
            <Checkbox
              checked={transpose}
              onChange={ev => this.setState({ transpose: ev.target.checked })}
            >
              Tranpose table
            </Checkbox>
          </FormGroup>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(UserMarks);
