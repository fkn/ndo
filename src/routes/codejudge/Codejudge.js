import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
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
    const { userId, dispatch, problems, modals } = this.props;

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
          <Modal defaultFooter="close" modalId="problemModal">
            <Modal.Body>
              {modals.problemModal_data && (
                <Fragment>
                  <h2>{modals.problemModal_data.title}</h2>
                  <ListGroup>
                    {modals.problemModal_data.tests.map(({ idcjtest, id }) => (
                      <ListGroupItem key={id}>{idcjtest}</ListGroupItem>
                    ))}
                  </ListGroup>
                </Fragment>
              )}
            </Modal.Body>
          </Modal>
          <ListGroup>
            {problems.map(problem => (
              <ListGroupItem
                action
                onClick={() => dispatch(showModal('problemModal', problem))}
                key={problem.id}
              >
                {problem.title}
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
