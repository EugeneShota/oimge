import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import FormFile from 'react-bootstrap/FormFile';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

class TopMenu extends React.Component {
  // constructor() {
  //
  // }
  dragOverFile(ev) {
    ev.preventDefault();
  }

  dragEnterFile(ev) {
    ev.preventDefault();
    alert('dd');
  }

  dradDropFile(ev) {}

  openImg() {}

  render() {
    return <Container fluid="fluid">
      <Row>
        <Col sm={2}>
          <Alert variant="primary">oIMGe</Alert>
        </Col>
        <Col sm={4}>
          <div className="fileInfo">
            <Spinner animation="border" size="sm" variant="warning"/>
            Name:, size:, ext:
          </div>
        </Col>
        <Col sm={5} className="fileInfo">
          <div className="openFileArea mr-2">
            <div className="openFileDDArea align-middle border border-primary rounded-pill"
              dragEnter={this.dragEnterFile}>
              <input type="file" id="openFileInput"/>
              <label htmlFor="openFileInput">Select</label>
              <span>
                or drag file
              </span>
            </div>
          </div>
        </Col>
        <Col sm={1} className="fileInfo">
          <Button variant="info" size="sm">Help</Button>
        </Col>
      </Row>
    </Container>
  }
}
export default TopMenu;
