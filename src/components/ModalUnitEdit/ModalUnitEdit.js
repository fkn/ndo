import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FormControl,
  Checkbox,
  ControlLabel,
  FormGroup,
  HelpBlock,
  Tabs,
  Tab,
} from 'react-bootstrap';
import Modal from '../../components/Modal';
import TextEditor from '../../components/TextEditor';
import UploadForm from '../../components/UploadForm';
import { updateUnit, addUnit } from '../../actions/units';

class ModalUnitEdit extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    modalId: PropTypes.string.isRequired,
    unit: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string,
    }).isRequired,
    edit: PropTypes.bool,
  };

  static defaultProps = {
    edit: true,
  };

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  };

  state = {};

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleFileUpload = async files => {
    const { fetch } = this.context;
    const formData = new FormData();
    formData.append('upload', files[0]);
    formData.append(
      'query',
      `mutation uploadFile($parentType: String!, $parentId: String!, $key: String!) {
        uploadFile(parentType: $parentType, parentId: $parentId, key: $key) { id internalName user { id } }
      }`,
    );
    formData.append(
      'variables',
      JSON.stringify({
        parentType: 'unit',
        parentId: this.props.unit.id,
        key: 'material',
      }),
    );
    try {
      const resp = await fetch('/graphql', {
        body: formData,
      });
      const { data } = await resp.json();
      if (this.editor)
        this.editor.session.insert(
          this.editor.getCursorPosition(),
          `/api/get_file/${data.uploadFile.id}`,
        );
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { dispatch, unit = {}, edit } = this.props;
    const {
      title = unit.title,
      body = unit.body,
      schema = unit.schema || '',
      tab = 'unit',
      answerable = unit.answerable,
    } = this.state;
    return (
      <Modal
        modalId={this.props.modalId}
        defaultFooter={edit ? 'save_close' : 'add_close'}
        onSubmit={() =>
          dispatch(
            edit
              ? updateUnit({ title, body, schema, id: unit.id, answerable })
              : addUnit({ title, body, schema, answerable }),
          )
        }
      >
        <Modal.Body>
          <Tabs activeKey={tab} onSelect={key => this.setState({ tab: key })}>
            <Tab eventKey="unit" title="Unit">
              <FormGroup controlId="title">
                <ControlLabel>Title</ControlLabel>
                <FormControl
                  autoFocus
                  type="text"
                  value={title}
                  name="title"
                  onChange={this.handleChange}
                />
                <HelpBlock>Title can not be empty</HelpBlock>
              </FormGroup>
              <FormGroup controlId="answerable">
                <Checkbox
                  checked={answerable}
                  onChange={ev =>
                    this.setState({ answerable: ev.target.checked })
                  }
                >
                  Student can add answer for this unit
                </Checkbox>
              </FormGroup>
              <FormGroup controlId="editor">
                <TextEditor
                  value={body}
                  onChange={value => this.setState({ body: value })}
                  onLoad={editor => (this.editor = editor)}
                />
              </FormGroup>
              {edit && (
                <FormGroup>
                  <UploadForm onUpload={this.handleFileUpload} />
                </FormGroup>
              )}
            </Tab>
            <Tab eventKey="schema" title="Schema">
              <FormGroup controlId="editSchema">
                <TextEditor
                  mode="json"
                  value={schema}
                  onChange={value => this.setState({ schema: value })}
                  onLoad={editor => (this.editor = editor)}
                />
              </FormGroup>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  course: state.course,
  unit: state.unit,
});

export default connect(mapStateToProps)(ModalUnitEdit);
