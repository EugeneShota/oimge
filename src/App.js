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
      imgScale: 1,
      toolSelected: {
        toolChange: true,
        toolOfElements: { tool: "rectangle", toolProperties: {} },
        toolOfAppearance: { tool: "color", toolProperties: {} },
        toolOfSelect: { tool: "", toolProperties: {} },
      },
      toolId: -1,
    };
    this.imgSetup = this.imgSetup.bind(this);
    this.initFabricCanvas = this.initFabricCanvas.bind(this);
    this.saveEditedImg = this.saveEditedImg.bind(this);
    this.setImgScale = this.setImgScale.bind(this);
    this.setSelectedTool = this.setSelectedTool.bind(this);
  }

  setImgScale(scale = 1) {
    this.setState({ imgScale: scale });
  }

  initFabricCanvas(fabricCanv) {
    if (fabricCanv) {
      console.log("FabricCanvas init... " + fabricCanv);
      this.setState({ fabricCanvas: fabricCanv });
    } else {
      console.log("fabricCanv - false...");
    }
  }

  setSelectedTool(tool, toolOf, toolProperties = {}) {
    if (tool && toolOf) {
      this.setState((prevState) => ({
        toolSelected: {
          ...prevState.toolSelected,
          toolChange: true,
          [toolOf]: {
            tool: tool,
            toolProperties: toolProperties,
          },
        },
      }));
    }
  }

  saveEditedImg() {
    console.log("> saveEditedImg...");
    if (this.state.fabricCanvas) {
      console.log("> fabricCanvas exist");
      this.state.fabricCanvas.discardActiveObject();
      this.state.fabricCanvas.renderAll();
      let multiple = (
        this.state.fabricCanvas.width /
        +this.state.fabricCanvas.backgroundImage.scaleY / //this.state.fabricCanvas.viewportTransform[0]
        this.state.fabricCanvas.width
      ).toFixed(15);
      alert("scaleX: " + multiple);
      let dataURL = this.state.fabricCanvas.toDataURL({
        format: "png",
        multiplier: multiple,
      });

      let downloadLink = document.createElement("a");
      downloadLink.download = "example.png";
      downloadLink.href = dataURL;
      downloadLink.click();
      URL.revokeObjectURL(downloadLink.href);
      // window.open(dataURL);

      // let canv = document.querySelector("#canv").toBlob((blob) => {
      //   console.log(blob);
      //   let downloadLink = document.createElement("a");
      //   downloadLink.download = "example.png";
      //   downloadLink.href = URL.createObjectURL(blob);
      //   downloadLink.click();
      //   URL.revokeObjectURL(downloadLink.href);
      // }, "image/png");

      // this.state.fabricCanvas.dispose(); //Clears a canvas and removes all event listeners
      // this.state.fabricCanvas.clear(); //full clear canvas

      // this.state.fabricCanvas.toBlob((blob) => {
      //   console.log("> blob: " + blob);
      // }, "image/png");
      // window.open(this.state.fabricCanvas.toDataURL("png"));
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
          <Header imgSetup={this.imgSetup} saveEditedImg={this.saveEditedImg} />
        </Row>
        <Row>
          <Col sm={1}>
            <EditTools
              setSelectedTool={this.setSelectedTool}
              toolSelected={this.state.toolSelected}
            />
          </Col>
          <Col sm={11}>
            <EditArea
              imgPath={this.state.imgPath}
              initFabricCanvas={this.initFabricCanvas}
              setImgScale={this.setImgScale}
              fabricCanvas={this.state.fabricCanvas}
              toolSelected={this.state.toolSelected}
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
