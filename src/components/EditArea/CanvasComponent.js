import React from "react";
import ReactDOM from "react-dom";
import fabric from "fabric/dist/fabric.js";
// import SrcImg from "./noIMG.png";
// import { setInitImg } from "../../main.js";

function rect(props) {
  const { ctx, x, y, width, height } = props;
  ctx.fillRect(x, y, width, height);
}

function setInitImg(props) {
  const { ctx, srcImg, typeRepeat, width, height } = props;
  let img = new Image();
  img.src = srcImg; //"../public/noIMG.png"
  console.log("setInitImg: " + srcImg);
  console.log("width: " + img.width + ", height: " + img.height);
  let aspectRatio = (img.width / img.height).toFixed(15);
  console.log("acpRatio " + aspectRatio);
  if (img.height > img.width || img.height > height) {
    console.log("if");
    img.height = img.height > height ? height : img.height;
    img.width = img.height * aspectRatio;
  } else {
    console.log("else");
    img.width = img.width > width ? width : img.width;
    img.height = img.width / aspectRatio;
  }
  console.log("width: " + img.width + ", height: " + img.height);
  let startDrawImgWidth = (width - img.width) / 2,
    startDrawImgHeight = (height - img.height) / 2;
  img.onload = function () {
    var pattern = ctx.createPattern(img, typeRepeat);
    ctx.fillStyle = pattern;
    ctx.drawImage(
      img,
      startDrawImgWidth,
      startDrawImgHeight,
      img.width,
      img.height
    );
    // ctx.fillRect(20,20,500,500);
    // rect({ctx, x: 20, y: 20, width, height});

    // setTimeout(() => {
    //   console.log("---TimeOut---");
    //   let canvFabric = new fabric.Canvas();
    //   let el = ReactDOM.findDOMNode("canv");
    //   canvFabric.initialize(el, { height: img.height, width: img.width });
    //   let rectF = new fabric.Rect({
    //     left: 100,
    //     top: 100,
    //     fill: "red",
    //     width: 20,
    //     height: 20,
    //   });
    //   canvFabric.add(rectF);
    // }, 5000);
  };
}

class CanvasComponent extends React.Component {
  constructor(props) {
    super(props);
    this.refCanv = React.createRef();
  }
  componentDidMount() {
    this.updateCanvas(this.props.imgPath);
  }
  componentDidUpdate() {
    this.updateCanvas(this.props.imgPath);
  }

  initCanvas(canv) {
    // const canv = document.querySelector("#canv");
    let canvPlace = document.querySelector(".canvPlace");
    let heightParentCont = document.querySelector(".parent-container")
      .offsetHeight;
    let heightHeader = document.querySelector(".header").offsetHeight;
    let heightFooter = document.querySelector(".footer").offsetHeight;
    let heightCanvPlace = heightParentCont - heightHeader - heightFooter;
    canvPlace.style.height = heightCanvPlace + "px";
    canv.height = heightCanvPlace;
    canv.width = canvPlace.offsetWidth;
    return { canvHeight: heightCanvPlace, canvWidth: canv.width };
  }

  updateCanvas(imgPath) {
    const canvasR = this.refCanv.current;
    let { canvHeight, canvWidth } = this.initCanvas(canvasR);
    const ctx = canvasR.getContext("2d");
    // ctx.clearRect(0, 0, 300, 300);
    // отобразить "дочерние" компоненты
    setInitImg({
      ctx,
      srcImg: imgPath,
      typeRepeat: "repeat",
      width: canvWidth,
      height: canvHeight,
    });
  }
  render() {
    // alert("render Canvas!");
    console.log("----------------------Render-------------------");

    // if (this.props.imgPath) {
    //   this.setState({ imgPath: this.props.imgPath });
    // }
    // const imgPath = this.props.imgPath;
    return (
      <div className="canvPlace">
        <canvas ref={this.refCanv} id="canv" />
      </div>
    );
  }
}

export default CanvasComponent;
