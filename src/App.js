import React from "react";
import "./App.css";
// import Alert from 'react-bootstrap/Alert';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import EditTools from "./components/EditTools/EditTools";
import EditArea from "./components/EditArea/EditArea";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer.js";

import SrcImg from "./components/EditArea/noIMG.png";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fabricCanvas: undefined,
      imgUploaded: false,
      imgPath: SrcImg,
      tollSelected: false,
      toolId: -1,
    };
    this.imgSetup = this.imgSetup.bind(this);
    this.initFabricCanvas = this.initFabricCanvas.bind(this);
  }

  initFabricCanvas(fabricCanv) {
    if (fabricCanv) {
      console.log("FabricCanvas init... " + fabricCanv);
      this.setState({ fabricCanvas: fabricCanv });
    } else {
      console.log("fabricCanv - false...");
    }
  }

  imgSetup(img, filePath) {
    if (img) {
      console.log("imgSetup: " + img.name + "; FilePath: " + filePath);
      this.setState({ imgUploaded: true, imgPath: filePath });
    }
  }

  render() {
    return (
      <Container fluid className="App parent-container">
        <Row>
          <Header imgSetup={this.imgSetup} />
        </Row>
        <Row>
          <Col sm={1}>
            <EditTools />
          </Col>
          <Col sm={11}>
            <EditArea
              imgPath={this.state.imgPath}
              initFabricCanvas={this.initFabricCanvas}
              fabricCanvas={this.state.fabricCanvas}
            />
          </Col>
        </Row>
        <Row>
          <Footer />
        </Row>
      </Container>
    );
  }
}

//   <div className="App">
//   <h1>Hi LoL</h1>
//   <EditTools />
// </div>;
