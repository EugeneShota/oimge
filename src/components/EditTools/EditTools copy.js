import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Image from "react-bootstrap/Image";

const EditTools = () => (
  <Container>
    <Row>
      <Col>
        <ButtonGroup vertical>
          <Button variant="outline-primary">Brush</Button>
          <Button variant="outline-primary">Text</Button>
          <DropdownButton
            as={ButtonGroup}
            title="Shapes"
            id="bg-vertical-dropdown-1"
            variant="outline-primary"
          >
            <Dropdown.Item eventKey="1">Rectangle</Dropdown.Item>
            <Dropdown.Item eventKey="2">Circle</Dropdown.Item>
            <Dropdown.Item eventKey="3">Line</Dropdown.Item>
            <Dropdown.Item eventKey="3">Arrow</Dropdown.Item>
          </DropdownButton>
          <Button variant="outline-primary">Cropping</Button>
          <DropdownButton
            as={ButtonGroup}
            title="'Attention'"
            id="bg-vertical-dropdown-2"
            variant="outline-primary"
          >
            <Dropdown.Item eventKey="1">Rectangle att</Dropdown.Item>
            <Dropdown.Item eventKey="2">Circle att</Dropdown.Item>
          </DropdownButton>
          <Button variant="outline-primary">Insert img</Button>
        </ButtonGroup>
      </Col>
      <Col></Col>
    </Row>
  </Container>
);

export default EditTools;
