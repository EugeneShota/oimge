import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import Alert from 'react-bootstrap/Alert';
// import Image from 'react-bootstrap/Image';
import iimg from "../../img/noIMG.png";
import CanvasComponent from "./CanvasComponent.js";

class EditArea extends React.Component {
  // constructor() {
  //
  // }

  render() {
    if (this.props.imgPath) {
      // alert("EditArea: " + this.props.imgPath);
    }
    return (
      <div className="EditArea">
        <Row>
          <Col>
            <CanvasComponent
              imgPath={this.props.imgPath}
              initFabricCanvas={this.props.initFabricCanvas}
              fabricCanvas={this.props.fabricCanvas}
              setImgScale={this.props.setImgScale}
              toolSelected={this.props.toolSelected}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default EditArea;
