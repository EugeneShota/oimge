import React from "react";
// import ReactDOM from "react-dom";
import { fabric } from "fabric/dist/fabric.min.js";

// import { setInitImg } from "../../main.js";

let fabricCanvas;
let creationObject;
let activeObjOnFCanv;
let createdObjType = "circle";
let createdObjCoords = { left: 0, top: 0, width: 1, height: 1 };
let createdObjStyle = { fillColor: "orange", strokeColor: "green" };

function checkClientCoords(clientXY) {
  if (clientXY) {
    return { clientX: clientXY.x, clientY: clientXY.y };
  }
  return { clientX: 0, clientY: 0 };
}

function createObjOnFCanv(fCanvas, coords, style, objType = "rect") {
  switch (objType) {
    case "rect":
      activeObjOnFCanv = addRectToFCanv(fCanvas, coords, style);
      break;
    case "circle":
      activeObjOnFCanv = addCircleToFCanv(fCanvas, coords, style);
    default:
      console.log("objType is incorrect...");
      break;
  }
}

function updateCreatedObjOnFCanv(fCanvas, updatableObj, updatablaData) {
  updatableObj.set({
    width: updatablaData.width,
    height: updatablaData.height,
  });

  //при обновлении объекта изменяется только визуал?

  fabricCanvas.discardActiveObject();
  fabricCanvas.remove(activeObjOnFCanv);
  createObjOnFCanv(
    fabricCanvas,
    createdObjCoords,
    createdObjStyle,
    createdObjType
  );

  // fCanvas.discardActiveObject();
  // fCanvas.setActiveObject(updatableObj);
  // fCanvas.renderCanvas();
}

function addRectToFCanv(fCanvas, coords, style) {
  let rectF = new fabric.Rect({
    left: coords.left,
    top: coords.top,
    fill: style.fillColor,
    stroke: style.strokeColor,
    width: coords.width,
    height: coords.height,
  });
  fCanvas.add(rectF);
  return rectF;
}

function addCircleToFCanv(fCanvas, coords, style) {
  let circleF = new fabric.Circle({
    left: coords.left,
    top: coords.top,
    fill: style.fillColor,
    stroke: style.strokeColor,
    radius: coords.width > coords.height ? coords.width / 2 : coords.height / 2,
  });
  fCanvas.add(circleF);
  return circleF;
}

function addImgToFabricCanv(fCanvas, img) {
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
    // addImgToFabricCanv(fabricCanvas, img);

    setTimeout(() => {
      addRectToFCanv(
        fabricCanvas,
        { left: 100, top: 200, width: 40, height: 60 },
        createdObjStyle
      );

      createObjOnFCanv(
        fabricCanvas,
        { left: 200, top: 220, width: 40, height: 60 },
        createdObjStyle,
        "rect"
      );
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
    //переделать
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

  //переделать только под didMount
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

      fabricCanvas.on("mouse:down", (options) => {
        console.log(">> mouse-down: " + fabricCanvas.getPointer());
        console.log("~~~~ options.target " + options.target);
        console.log("}options" + options.e);
        if (!options.target) {
          ({
            clientX: createdObjCoords.left,
            clientY: createdObjCoords.top,
          } = checkClientCoords(fabricCanvas.getPointer()));

          createObjOnFCanv(
            fabricCanvas,
            createdObjCoords,
            createdObjStyle,
            createdObjType
          );
          console.log(createdObjCoords);
        }
      });
      fabricCanvas.on("mouse:up", (options) => {
        // console.log(
        //   ">> mouse-up: " + options.e.clientX + "x" + options.e.clientY
        // );
        console.log("target: " + fabricCanvas.getPointer());
        if (!options.target) {
          let { clientX: x, clientY: y } = checkClientCoords(
            fabricCanvas.getPointer()
          );

          if (x < createdObjCoords.left) {
            createdObjCoords.width = createdObjCoords.left - x;
            createdObjCoords.left = x;
          } else {
            createdObjCoords.width = x - createdObjCoords.left;
          }
          if (y < createdObjCoords.top) {
            createdObjCoords.height = createdObjCoords.top - y;
            createdObjCoords.top = y;
          } else {
            createdObjCoords.height = y - createdObjCoords.top;
          }

          updateCreatedObjOnFCanv(
            fabricCanvas,
            activeObjOnFCanv,
            createdObjCoords
          );

          console.log(createdObjCoords);

          createdObjCoords = { left: 0, top: 0, width: 1, height: 1 };
        }
      });
      fabricCanvas.on("mouse:move", (options) => {
        // console.log(
        //   ">> mouse-move: " + options.e.clientX + "x" + options.e.clientY
        // );
      });
      this.props.initFabricCanvas(fabricCanvas);
    }
    //использовать при обновлении
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
