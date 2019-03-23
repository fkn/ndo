/* eslint-disable no-restricted-syntax */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Table } from 'react-bootstrap';
import s from './CourseMarks.css';
import { UnitPropType } from './AnswerList';
import User from '../../components/User/User';
import Link from '../../components/Link/Link';

class TableRenderer {
  constructor() {
    this.data1 = [];
    this.data2 = [];
    this.dataCell = new Map();
  }
  setData(data1, data2, dataCell, courseId) {
    this.data1 = data1;
    this.data2 = data2;
    this.dataCell = dataCell;
    this.courseId = courseId;
  }
  cols() {
    return this.data1;
  }
  rows() {
    return this.data2;
  }
  renderColHeader(val, i) {
    return <User key={this.data1[i].id} user={this.data1[i]} hideTags />;
  }
  renderRowHeader(val, i) {
    const { id, title } = this.data2[i];
    return <Link to={`/courses/${this.courseId}/${id}`}>{title}</Link>;
  }
  // eslint-disable-next-line class-methods-use-this
  renderCell(i, j) {
    const id = `${this.rows()[i].id} ${this.cols()[j].id}`;
    const data = this.dataCell.get(id);
    const tags = [s.mark];
    if (!(data && data.length)) tags.push(s.noAnswer);
    const amark = data && data.find(d => d.marks && d.marks.length);
    if (!amark) tags.push(s.noMark);
    const mark = amark && amark.marks[amark.marks.length - 1];
    return (
      <td key={id} className={tags.join(' ')}>
        {mark && Math.floor(mark.mark)}
      </td>
    );
  }
  static buildCells(units) {
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

  constructor() {
    super();
    this.renderer = new TableRenderer();
  }

  render() {
    const { units, users, title, id } = this.props.course;
    this.renderer.setData(users, units, TableRenderer.buildCells(units), id);
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Marks of {title}</h1>
          <Table>
            <thead>
              <tr>
                <th className={s.noneEvents} />
                {this.renderer.cols().map((val, i) => (
                  <th key={val.id}>{this.renderer.renderColHeader(val, i)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.renderer.rows().map((val, i) => (
                <tr key={val.id}>
                  <th>{this.renderer.renderRowHeader(val, i)}</th>
                  {this.renderer
                    .cols()
                    .map((val2, j) => this.renderer.renderCell(i, j))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(UserMarks);
