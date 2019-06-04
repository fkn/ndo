import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import {
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { showModal } from '../../actions/modals';
import IconButton from '../../components/IconButton/IconButton';
import Modal from '../../components/Modal/Modal';
import ModalProblemEdit from '../../components/ModalProblemEdit/ModalProblemEdit';
import deleteCjTestMutation from '../../gql/deleteCjTest.gql';
import createCjTestMutation from '../../gql/createCjTest.gql';
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
        tests: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            idCj: PropTypes.string.isRequired,
          }),
        ),
      }),
    ),
  };

  static contextTypes = { fetch: PropTypes.func.isRequired };

  static defaultProps = {
    userId: null,
    problems: [],
  };

  state = {
    input: '',
    output: '',
  };

  onTextareaChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  createCjTest = async problemId => {
    const { input, output } = this.state;
    try {
      await this.context.fetch('/graphql', {
        body: JSON.stringify({
          query: createCjTestMutation,
          variables: {
            input,
            output,
            problemId,
          },
        }),
      });
    } catch (error) {
      throw error;
    }
  };

  deleteCjTest = async id => {
    try {
      await this.context.fetch('/graphql', {
        body: JSON.stringify({
          query: deleteCjTestMutation,
          variables: {
            id,
          },
        }),
      });
    } catch (error) {
      throw error;
    }
  };

  render() {
    const { input, output } = this.state;
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
                  <FormGroup>
                    <ControlLabel>Input</ControlLabel>
                    <FormControl
                      componentClass="textarea"
                      placeholder="Enter input values"
                      value={input}
                      name="input"
                      onChange={this.onTextareaChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Output</ControlLabel>
                    <FormControl
                      componentClass="textarea"
                      placeholder="Enter expected output"
                      value={output}
                      name="output"
                      onChange={this.onTextareaChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() =>
                        this.createCjTest(modals.problemModal_data.id)
                      }
                    >
                      Add test
                    </Button>
                  </FormGroup>
                  <ListGroup>
                    {modals.problemModal_data.tests.map(({ idCj, id }) => (
                      <Row key={id}>
                        <Col md={8}>
                          <ListGroupItem>{idCj}</ListGroupItem>
                        </Col>
                        <Col>
                          <IconButton
                            onClick={() => this.deleteCjTest(id)}
                            glyph="trash"
                          />
                        </Col>
                      </Row>
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
