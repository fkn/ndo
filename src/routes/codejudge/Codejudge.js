import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { showModal } from '../../actions/modals';
import IconButton from '../../components/IconButton/IconButton';
import Modal from '../../components/Modal/Modal';
import ModalProblemEdit from '../../components/ModalProblemEdit/ModalProblemEdit';
import s from './Codejudge.css';

class Codejudge extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    modals: PropTypes.instanceOf(Object).isRequired,
    title: PropTypes.string.isRequired,
    userId: PropTypes.string,
    problems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }),
    ),
  };

  static defaultProps = {
    userId: null,
    problems: [],
  };

  render() {
    const { userId, dispatch, problems } = this.props;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.title}
            {userId && (
              <IconButton
                onClick={() => dispatch(showModal('modalAddProblem'))}
                glyph="plus"
              />
            )}
          </h1>
          <ModalProblemEdit
            modalId="modalAddProblem"
            defaultFooter="add_close"
          />
          <ListGroup>
            <Modal defaultFooter="close" modalId="problemModal">
              <Modal.Body>
                <h2>{this.props.modals.problemModal_data}</h2>
              </Modal.Body>
            </Modal>
            {problems.map(({ id, title }) => (
              <ListGroupItem
                action
                onClick={() => dispatch(showModal('problemModal', title))}
                key={id}
              >
                {title}
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.user && state.user.id,
  modals: state.modals,
});

export default connect(mapStateToProps)(withStyles(s)(Codejudge));
