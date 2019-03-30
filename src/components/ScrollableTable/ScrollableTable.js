import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Table } from 'react-bootstrap';
import s from './ScrollableTable.css';

class ScrollableTable extends React.Component {
  static propTypes = {
    transpose: PropTypes.bool,
    data1: PropTypes.instanceOf(Array).isRequired,
    data2: PropTypes.instanceOf(Array).isRequired,
    dataCells: PropTypes.instanceOf(Map).isRequired,
    renderHeader1: PropTypes.func.isRequired,
    renderHeader2: PropTypes.func.isRequired,
    renderCell: PropTypes.func.isRequired,
  };

  static defaultProps = {
    transpose: false,
  };

  cols() {
    const data = this.props.transpose ? this.props.data2 : this.props.data1;
    return data;
  }
  rows() {
    const data = this.props.transpose ? this.props.data1 : this.props.data2;
    return data;
  }
  renderColHeader(i) {
    if (this.props.transpose)
      return this.props.renderHeader2(this.props.data2[i]);
    return this.props.renderHeader1(this.props.data1[i]);
  }
  renderRowHeader(i) {
    if (this.props.transpose)
      return this.props.renderHeader1(this.props.data1[i]);
    return this.props.renderHeader2(this.props.data2[i]);
  }
  renderCell(i, j) {
    const id = this.props.transpose
      ? `${this.cols()[j].id} ${this.rows()[i].id}`
      : `${this.rows()[i].id} ${this.cols()[j].id}`;
    return this.props.renderCell(this.props.dataCells.get(id), id);
  }
  render() {
    return (
      <div className={s.tableScroller}>
        <Table>
          <thead>
            <tr>
              <th className={s.ltCorner} />
              {this.cols().map((val, i) => (
                <th key={val.id}>{this.renderColHeader(i)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.rows().map((val, i) => (
              <tr key={val.id}>
                <th className={s.rowHeader}>{this.renderRowHeader(i)}</th>
                {this.cols().map((val2, j) => this.renderCell(i, j))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default withStyles(s)(ScrollableTable);
