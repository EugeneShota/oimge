import React from "react";
// import ReactDOM from "react-dom";
// import "fabric/dist/fabric.js";
import { fabric } from "fabric/dist/fabric.min.js";
// import SrcImg from "./noIMG.png";
// import { setInitImg } from "../../main.js";

let fabricCanvas;

function addImgToFabricCanvas(fCanvas, img) {
  console.log(">>>>>>" + fCanvas.width);
  let { scaleX, scaleY } = calcScale(img, fCanvas.width, fCanvas.height);

  console.log(
    ">>f addImg" + img.src + "- scaleW: " + scaleX + " scaleH: " + scaleY
  );
  let fImage = new fabric.Image(img, {
    scaleX: scaleX,
    scaleY: scaleY,
  });
  fCanvas.add(fImage);
}

function calcScale(img, containerWidth, containerHeight) {
  let scaleWidth = (containerWidth / img.width).toFixed(15);
  let scaleHeight = (containerHeight / img.height).toFixed(15);
  console.log(">>>> scaleX: " + scaleWidth + " - scaleY: " + scaleHeight);
  return { scaleX: scaleWidth, scaleY: scaleHeight };
}

function calcAspRatio(img, containerWidth, containerHeight) {
  let aspectRatio = (img.width / img.height).toFixed(15);
  let newWidth, newHeight;
  if (img.height > img.width) {
    newHeight = img.height > containerHeight ? containerHeight : img.height;
    newWidth = newHeight * aspectRatio;
  } else {
    newWidth = img.width > containerWidth ? containerWidth : img.width;
    newHeight = newWidth / aspectRatio;
  }
  console.log(
    ">>>> aspR: " + aspectRatio + " newW: " + newWidth + " newH:" + newHeight
  );
  return { aspectRatio, newWidth, newHeight };
}

function calcZoomFCanvas(img) {}

function setInitImg(props) {
  const {
    fabricCanvas,
    srcImg,
    typeRepeat,
    width,
    height,
    setImgScale,
  } = props;
  // создание изображения
  // let img = new Image();
  let img = document.createElement("img");
  console.log(">>>>srcIMG (setInitImg): " + srcImg);
  img.crossOrigin = "Anonymous";
  img.src = srcImg; //"../public/noIMG.png"
  img.onload = function () {
    console.log("setInitImg: " + srcImg);
    console.log("width: " + img.width + ", height: " + img.height);
    let { aspectRatio, newWidth, newHeight } = calcAspRatio(img, width, height);
    let { scaleX, scaleY } = calcScale(img, width, height);
    // определение начальной точки для вставки изображения
    let startDrawImgWidth = (newWidth - img.width * scaleY) / 2,
      startDrawImgHeight = (img.height - newHeight) / 2;

    console.log(
      ">>> srcImg: " + srcImg + " startDrawImgWidth:" + startDrawImgWidth
    );

    // fabricCanvas.setZoom(scaleY);

    fabricCanvas.setBackgroundImage(
      srcImg,
      fabricCanvas.renderAll.bind(fabricCanvas),
      {
        left: startDrawImgWidth,
        // top: startDrawImgHeight,
        // width: newWidth,
        // height: newHeight,
        originX: "left",
        originY: "top",
        scaleX: scaleY,
        scaleY: scaleY,
        crossOrigin: "anonymous",
      }
    );
    // addImgToFabricCanvas(fabricCanvas, img);

    setTimeout(() => {
      // console.log("---TimeOut---");
      // let el = ReactDOM.findDOMNode("canv");
      // canvFabric.initialize(el, { height: img.height, width: img.width });
      let rectF = new fabric.Rect({
        left: 100,
        top: 100,
        fill: "red",
        stroke: "blue",
        width: 20,
        height: 20,
      });
      fabricCanvas.add(rectF);
    }, 2500);
    // setImgScale(scaleX);
  };

  // fabric.Image.fromURL(srcImg, function (imgF) {
  //   // alert("eree");

  //   // alert("width: " + imgF.width + ", height: " + imgF.height);
  //   // alert("width: " + img.width + ", height: " + img.height);
  //   imgF.set({
  //     left: startDrawImgWidth,
  //     top: startDrawImgHeight,
  //     // width: newWidth,
  //     // height: newHeight,
  //     originX: "left",
  //     originY: "top",
  //     scaleX: scaleX,
  //     scaleY: scaleY,
  //   });
  //   fabricCanvas.setBackgroundImage(
  //     imgF,
  //     fabricCanvas.renderAll.bind(fabricCanvas)
  //   );
  // });

  //tyt

  // img.onload = function () {
  //   var pattern = ctx.createPattern(img, typeRepeat);
  //   ctx.fillStyle = pattern;
  //   ctx.drawImage(
  //     img,
  //     startDrawImgWidth,
  //     startDrawImgHeight,
  //     img.width,
  //     img.height
  //   );

  // };
}

class CanvasComponent extends React.Component {
  constructor(props) {
    super(props);
    this.refCanv = React.createRef();
  }
  componentDidMount() {
    // alert("CanvComp componentDidMount()");
    this.updateCanvas(this.props.imgPath);
  }
  componentDidUpdate() {
    // alert("CanvComp componentDidUpdate()");
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
    return { canvHeight: canv.height, canvWidth: canv.width };
  }

  initFabricCanvas() {}

  updateCanvas(imgPath) {
    const canvasR = this.refCanv.current;
    let { canvHeight, canvWidth } = this.initCanvas(canvasR);
    // let fabricCanvas;
    // const ctx = canvasR.getContext("2d");
    if (this.props.fabricCanvas) {
      // alert("fabricCanvas - true");
      console.log("fabricCanvas - true");
      // fabricCanvas = this.props.fabricCanvas;
    } else {
      fabricCanvas = new fabric.Canvas("canv");
      this.props.initFabricCanvas(fabricCanvas);
    }
    // ctx.clearRect(0, 0, 300, 300);
    // отобразить "дочерние" компоненты
    setInitImg({
      fabricCanvas,
      srcImg: imgPath,
      typeRepeat: "repeat",
      width: canvWidth,
      height: canvHeight,
      setImgScale: this.props.setImgScale,
    });
  }
  render() {
    console.log("-------Render-------");
    return (
      <div className="canvPlace">
        <canvas ref={this.refCanv} id="canv" />
      </div>
    );
  }
}

export default CanvasComponent;
