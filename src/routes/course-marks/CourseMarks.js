/* eslint-disable no-restricted-syntax */
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Table, FormGroup, Checkbox } from 'react-bootstrap';
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
  renderHeader1(i) {
    return <User key={this.data1[i].id} user={this.data1[i]} hideTags />;
  }
  renderHeader2(i) {
    const { id, title } = this.data2[i];
    return <Link to={`/courses/${this.courseId}/${id}`}>{title}</Link>;
  }
  cols() {
    const data = this.transpose ? this.data2 : this.data1;
    return data;
  }
  rows() {
    const data = this.transpose ? this.data1 : this.data2;
    return data;
  }
  renderColHeader(val, i) {
    if (this.transpose) return this.renderHeader2(i);
    return this.renderHeader1(i);
  }
  renderRowHeader(val, i) {
    if (this.transpose) return this.renderHeader1(i);
    return this.renderHeader2(i);
  }
  // eslint-disable-next-line class-methods-use-this
  renderCell(i, j) {
    const id = this.transpose
      ? `${this.cols()[j].id} ${this.rows()[i].id}`
      : `${this.rows()[i].id} ${this.cols()[j].id}`;
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

  static sortUsers(a, b) {
    const name1 = a.profile.displayName;
    const name2 = b.profile.displayName;
    return name1.localeCompare(name2);
  }

  static sortUnits(a, b) {
    return a.title.localeCompare(b.title);
  }

  constructor() {
    super();
    this.renderer = new TableRenderer();
  }

  state = {};

  render() {
    const { units, users, title, id } = this.props.course;
    const { transpose } = this.state;
    const visUsers = users
      .filter(u => u.role === 'student')
      .sort(UserMarks.sortUsers);
    const visUnits = units.filter(u => u.answerable).sort(UserMarks.sortUnits);
    const cells = TableRenderer.buildCells(visUnits);
    this.renderer.setData(visUsers, visUnits, cells, id);
    this.renderer.transpose = transpose;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Marks of {title}</h1>
          <div className={s.tableScroller}>
            <Table>
              <thead>
                <tr>
                  <th className={s.ltCorner} />
                  {this.renderer.cols().map((val, i) => (
                    <th key={val.id}>
                      {this.renderer.renderColHeader(val, i)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {this.renderer.rows().map((val, i) => (
                  <tr key={val.id}>
                    <th className={s.rowHeader}>
                      {this.renderer.renderRowHeader(val, i)}
                    </th>
                    {this.renderer
                      .cols()
                      .map((val2, j) => this.renderer.renderCell(i, j))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
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
