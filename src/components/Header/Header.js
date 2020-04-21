import React from "react";

import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";

import "./Header.css";

import { toggleClassInEl } from "../../main.js";

const IMG_HOST = "http://localhost:9001";
// import FileInfo from "./FileInfo";

async function uploadFile(file, el, cb) {
  let formData = new FormData();
  let tempImg = new Image(file);
  let tempSImg = new Image();
  tempSImg.src = file;
  tempSImg.onload = () => {
    console.log(
      ">>> uploadFile: " +
        file.name +
        ":" +
        tempImg.width +
        "x" +
        tempImg.height
    );
  };

  console.log(">>> tempS:" + tempSImg.width);
  formData.type = "multipart/form-data";
  // console.log(file);
  formData.append("image", file, "image.png");
  let respons = await fetch(IMG_HOST + "/upload", {
    method: "POST",
    body: formData,
  });
  let result = await respons.json();
  if (respons.ok) {
    console.log("el: " + el);
    toggleClassInEl([el], ["anim-FileIsLoading"]);
    await cb(file, IMG_HOST + result.filePath);
  } else {
    alert("Oops...");
  }
  // alert(result.filePath);
  // return false;
}

export default class Header extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  dragOverFile(ev) {
    ev.preventDefault();
  }

  dragEnterFile(ev) {
    ev.preventDefault();
    let el = ev.target.className;
  }

  selectFiles(fImgSetup, event) {
    event.preventDefault();
    let parentEl = event.target.parentNode;
    toggleClassInEl([parentEl], ["anim-FileIsLoading"]);
    uploadFile(event.target.files[0], parentEl, fImgSetup);
  }

  dropFile(fImgSetup, event) {
    event.preventDefault();
    let data = event.dataTransfer;
    let dropedFiles = data.files;
    let countFiles = dropedFiles.length;
    console.log("count files: " + countFiles);

    for (let i = 0; i < dropedFiles.length; i++) {
      console.log(
        "File: " + dropedFiles[i].name + ", size: " + dropedFiles[i].size
      );
    }
    let el = event.target;
    // alert(data);
    toggleClassInEl([el], ["anim-FileIsLoading"]);
    uploadFile(dropedFiles[0], el, fImgSetup);
  }

  openImg() {}

  render() {
    const imgSetup = this.props.imgSetup;
    return (
      <Container fluid="fluid" className="header">
        <Row className="">
          <Col sm={2}>
            <div>oIMGe</div>
            <Button
              variant="success"
              size="sm"
              onClick={this.props.saveEditedImg}
            >
              Save
            </Button>
          </Col>
          {/* <Col sm={4}>
            <FileInfo />
          </Col> */}
          <Col sm={9} className="fileInfo">
            <div className="openFileArea mr-2">
              <div
                className="openFileDDArea align-middle"
                draggable="true"
                onDragEnter={this.dragEnterFile}
                onDrop={this.dropFile.bind(this, imgSetup)}
                onDragOver={this.dragOverFile}
              >
                <input
                  type="file"
                  id="openFileInput"
                  name="filedata"
                  onInput={this.selectFiles.bind(this, imgSetup)}
                />
                <label htmlFor="openFileInput">Select</label>
                <span>&nbsp;or drag file</span>
              </div>
            </div>
          </Col>
          <Col sm={1} className="">
            <ButtonGroup vertical>
              <Button variant="light" size="sm">
                Help
              </Button>
              <Button variant="info" size="sm">
                Info
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}
