import React from "react";
// import ReactDOM from "react-dom";
import { fabric } from "fabric/dist/fabric.min.js";

// import { setInitImg } from "../../main.js";

let fabricCanvas;
let creationObject;
let activeObjOnFCanv = null;
let createdObjType = "rectangle";
let createdObjCoords = {
  left: 0,
  top: 0,
  width: 1,
  height: 1,
  startpointX: 0,
  startpointY: 0,
  endpointX: 1,
  endpointY: 1,
};
let createdObjStyle = { fillColor: "orange", strokeColor: "green" };

function checkClientCoords(clientXY) {
  if (clientXY) {
    return { clientX: clientXY.x, clientY: clientXY.y };
  }
  return { clientX: 0, clientY: 0 };
}

function createObjOnFCanv(
  fCanvas,
  coords,
  style,
  objType = "rectangle",
  isUpdated = false
) {
  switch (objType) {
    case "rectangle":
      activeObjOnFCanv = addRectToFCanv(fCanvas, coords, style);
      break;
    case "ellipse":
      activeObjOnFCanv = addEllipseToFCanv(fCanvas, coords, style);
      break;
    case "line":
      activeObjOnFCanv = addLineToFCanv(fCanvas, coords, style);
      break;
    case "text":
      activeObjOnFCanv = addTextToFCanv(fCanvas, coords, style); //+text
      break;
    case "brush":
      activeObjOnFCanv = freeDrawingToFCanv(fCanvas, style);
      break;
    case "rectangle-attention":
      activeObjOnFCanv = addRectToFCanv(fCanvas, coords, {
        fillColor: null,
        strokeColor: "orange",
      });
      if (isUpdated) {
        activeObjOnFCanv = addPathToFCanv(
          fCanvas,
          coords,
          style,
          activeObjOnFCanv
        );
      }
      break;
    case "ellipse-attention":
      activeObjOnFCanv = addEllipseToFCanv(fCanvas, coords, style, true);
      break;
    default:
      console.log("objType is incorrect...");
      break;
  }
}

function updateCreatedObjOnFCanv(fCanvas, updatableObj, newCoords) {
  if (updatableObj === null) return;

  updatableObj.set({
    width: newCoords.width,
    height: newCoords.height,
  });

  //при обновлении объекта изменяется только визуал?

  fabricCanvas.discardActiveObject();
  fabricCanvas.remove(activeObjOnFCanv);
  createObjOnFCanv(fCanvas, newCoords, createdObjStyle, createdObjType, true);
  return null;
  // fCanvas.discardActiveObject();
  // fCanvas.setActiveObject(updatableObj);
  // fCanvas.renderCanvas();
}

function updateCreatedObjOnMouseMove(
  fCanvas,
  updatableObj,
  newCoords,
  newStyle,
  updatableObjType
) {
  if (newCoords !== null) {
    let coords;
    switch (updatableObjType) {
      case "line":
        coords = {
          x1: newCoords.startpointX,
          y1: newCoords.startpointY,
          x2: newCoords.endpointX,
          y2: newCoords.endpointY,
        };
        console.log(coords);
        break;
      case "ellipse":
        coords = {
          left: newCoords.left,
          top: newCoords.top,
          rx: newCoords.width / 2 > 1 ? newCoords.width / 2 : 1,
          ry: newCoords.height / 2 > 1 ? newCoords.height / 2 : 1,
        };
        break;
      default:
        coords = newCoords;
    }

    updatableObj.set(coords);
  }

  if (newStyle !== null) {
    updatableObj.set(newStyle);
  }

  fCanvas.renderAll();
  return updatableObj;
}

function addRectToFCanv(fCanvas, coords, style, shadow = false) {
  let rectF = new fabric.Rect({
    left: coords.left,
    top: coords.top,
    fill: style.fillColor,
    stroke: style.strokeColor,
    width: coords.width,
    height: coords.height,
  });
  fCanvas.add(rectF);
  // rectF.setShadow({ color: "black", offsetX: 0, offsetY: 0, blur: 100 });
  return rectF;
}

function addEllipseToFCanv(fCanvas, coords, style, shadow = false) {
  let circleF = new fabric.Ellipse({
    left: coords.left,
    top: coords.top,
    rx: coords.width / 2,
    ry: coords.height / 2,
    fill: style.fillColor,
    stroke: style.strokeColor,
    // radius: coords.width > coords.height ? coords.width / 2 : coords.height / 2,
  });
  fCanvas.add(circleF);
  return circleF;
}

function addLineToFCanv(fCanvas, coords, style) {
  let lineF = new fabric.Line(
    [
      coords.startpointX,
      coords.startpointY,
      coords.endpointX,
      coords.endpointY,
    ],
    {
      fill: style.fillColor,
      stroke: style.strokeColor,
    }
  );
  fCanvas.add(lineF);
  return lineF;
}

function addTextToFCanv(
  fCanvas,
  coords,
  style,
  text = "Double click to change text..."
) {
  let textF = new fabric.IText(text, {
    left: coords.left,
    top: coords.top,
    // width: coords.width,
    // height: coords.height,
    fontSize: 20,
  });
  fCanvas.add(textF);
  return textF;
}

function addPathToFCanv(fCanvas, coords, style, borderObj) {
  //передавать тип(прямоугольник\круг) и объект - брать размеры
  // если ничего не переданно - создаем прямоугольник\круг
  // в зависимости от типа
  console.log("=== border object: " + borderObj);

  let path2 =
    "M0,0v" +
    fCanvas.height +
    "h" +
    fCanvas.width +
    "V0H0z M" +
    (coords.left + coords.width) +
    "," +
    (coords.top + coords.height) +
    "H" +
    coords.left +
    "v-" +
    coords.height +
    "h" +
    coords.width +
    "V" +
    (coords.top + coords.height) +
    "z";

  let canvPath = "M0,0v" + fCanvas.height + "h" + fCanvas.width + "V0H0z";

  let path21 =
    "M" +
    (coords.left + coords.width) +
    "," +
    (coords.top + coords.height) +
    "H" +
    coords.left +
    "v-" +
    coords.height +
    "h" +
    coords.width +
    "V" +
    (coords.top + coords.height) +
    "z";

  let path3 =
    "M" +
    (coords.left + coords.width + 100) +
    "," +
    (coords.top + coords.height + 100) +
    "H" +
    (coords.left + 100) +
    "v-" +
    coords.height +
    "h" +
    coords.width +
    "V" +
    (coords.top + coords.height + 100) +
    "z";

  let finalyPath =
    "<svg><path d='" + canvPath + path21 + " " + path3 + "'/></svg>";
  console.log(finalyPath);
  //M(координаты для вертикальной левой лении)
  //v350h450
  //V(координаты горизонтальной верхней линии)H0z

  fabric.loadSVGFromString(finalyPath, (objects, options) => {
    let obj = fabric.util.groupSVGElements(objects, options);
    obj.set({ opacity: 0.65, selectable: false });
    fCanvas.add(obj);
    obj.moveTo(0);
    fCanvas.renderAll();
  });

  let pathF = new fabric.Path(path2, { opacity: 0.5, selectable: false });

  // let pathF2 = new fabric.PathGroup([], { opacity: 0.5, selectable: false });
  // fCanvas.add(pathF);
  // pathF.moveTo(0);
  // let groupF = new fabric.Group([borderObj, pathF]);
  // console.log(">> GROUP <<" + groupF);
  // borderObj.on("modified", (options) => {
  //   alert(options + " - " + fCanvas.getActiveObject());
  // });
  return pathF;
}

function freeDrawingToFCanv(fCanvas, style) {
  if (fCanvas) {
    fCanvas.isDrawingMode = true;
    // console.log("color: >" + new fabric.Color("#787878").toRgb());
    fCanvas.freeDrawingBrush.color = style.fillColor;
    fCanvas.freeDrawingBrush.width = 5;
  }
  console.log("color: >" + new fabric.Color("#787878").toRgb());
  return true;
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

    // setTimeout(() => {
    //   addRectToFCanv(
    //     fabricCanvas,
    //     { left: 100, top: 200, width: 40, height: 60 },
    //     createdObjStyle
    //   );

    //   createObjOnFCanv(
    //     fabricCanvas,
    //     { left: 200, top: 220, width: 40, height: 60 },
    //     createdObjStyle,
    //     "rect"
    //   );
    // }, 2500);
  };
}

class CanvasComponent extends React.Component {
  constructor(props) {
    super(props);
    this.refCanv = React.createRef();
  }
  componentDidMount() {
    // alert("CanvComp componentDidMount()");
    this.mountFabricCanvas(this.props.imgPath);
  }
  componentDidUpdate(prevProps) {
    // alert("CanvComp componentDidUpdate()");
    //переделать
    // this.initFabricCanvas(this.props.imgPath);
    if (
      !this.props.toolSelected.toolChange ||
      prevProps.imgPath !== this.props.imgPath
    ) {
      this.updateFabricCanvas(this.props.imgPath, fabricCanvas, createdObjType);
    } else {
    }
    fabricCanvas.isDrawingMode =
      createdObjType === "brush"
        ? freeDrawingToFCanv(fabricCanvas, createdObjStyle)
        : false;
  }

  getSizeOFCanvas(canv) {
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

  updateFabricCanvas(imgPath, fabricCanvas, createdObjType) {
    const canvasR = this.refCanv.current;
    fabricCanvas.isDrawingMode = createdObjType === "brush" ? true : false;
    let { canvHeight, canvWidth } = this.getSizeOFCanvas(canvasR);
    setInitImg({
      fabricCanvas,
      srcImg: imgPath,
      typeRepeat: "repeat",
      width: canvWidth,
      height: canvHeight,
      setImgScale: this.props.setImgScale,
    });
  }

  //переделать только под didMount
  mountFabricCanvas(imgPath) {
    const canvasR = this.refCanv.current;
    let { canvHeight, canvWidth } = this.getSizeOFCanvas(canvasR);
    // let fabricCanvas;
    if (this.props.fabricCanvas) {
      console.log("fabricCanvas - true");
      // fabricCanvas = this.props.fabricCanvas;
    } else {
      fabricCanvas = new fabric.Canvas("canv");

      fabricCanvas.selection = false; //group selection disable

      fabricCanvas.on("mouse:down", (options) => {
        console.log(">> mouse-down: " + fabricCanvas.getPointer());
        console.log("~~~~ options.target " + options.target);
        console.log("}options" + options.e);

        if (this.props.toolSelected.toolChange && createdObjType !== "brush") {
          if (!options.target || options.target.type === "path") {
            // && createdObjType !== "brush"
            // fabricCanvas.isDrawingMode =
            //   createdObjType === "brush" ? true : false;
            ({
              clientX: createdObjCoords.left,
              clientY: createdObjCoords.top,
            } = checkClientCoords(fabricCanvas.getPointer()));

            createdObjCoords.startpointX = createdObjCoords.left;
            createdObjCoords.startpointY = createdObjCoords.top;
            createdObjCoords.endpointX = +createdObjCoords.startpointX + 1;
            createdObjCoords.endpointY = +createdObjCoords.startpointY + 1;

            createObjOnFCanv(
              fabricCanvas,
              createdObjCoords,
              createdObjStyle,
              createdObjType
            );
            console.log(createdObjCoords);
          } else {
            console.log(options.target.type + "<<<");
          }
        }
      });

      fabricCanvas.on("mouse:up", (options) => {
        // console.log(
        //   ">> mouse-up: " + options.e.clientX + "x" + options.e.clientY
        // );
        console.log("target: " + fabricCanvas.getPointer());

        if (this.props.toolSelected.toolChange && createdObjType !== "brush") {
          if (!options.target || options.target.type === "path") {
            let { clientX: x, clientY: y } = checkClientCoords(
              fabricCanvas.getPointer()
            );

            if (x < createdObjCoords.startpointX) {
              createdObjCoords.left = x;
              createdObjCoords.width = createdObjCoords.startpointX - x;
            } else {
              createdObjCoords.width = x - createdObjCoords.startpointX;
            }
            if (y < createdObjCoords.startpointY) {
              createdObjCoords.top = y;
              createdObjCoords.height = createdObjCoords.startpointY - y;
            } else {
              createdObjCoords.height = y - createdObjCoords.startpointY;
            }

            createdObjCoords.endpointX = x;
            createdObjCoords.endpointY = y;

            activeObjOnFCanv = updateCreatedObjOnFCanv(
              fabricCanvas,
              activeObjOnFCanv,
              createdObjCoords
            );

            console.log(createdObjCoords);

            createdObjCoords = { left: 0, top: 0, width: 1, height: 1 };
          }
        }
      });

      fabricCanvas.on("mouse:move", (options) => {
        // console.log(
        //   ">> mouse-move: " + options.e.clientX + "x" + options.e.clientY
        // );
        if (activeObjOnFCanv !== null && createdObjType !== "brush") {
          let { clientX: x, clientY: y } = checkClientCoords(
            fabricCanvas.getPointer()
          );

          if (x < createdObjCoords.startpointX) {
            createdObjCoords.left = x - 1;
            createdObjCoords.width = createdObjCoords.startpointX - x - 1;
          } else {
            createdObjCoords.width = x - createdObjCoords.startpointX - 1;
          }
          if (y < createdObjCoords.startpointY) {
            createdObjCoords.top = y - 1;
            createdObjCoords.height = createdObjCoords.startpointY - y - 1;
          } else {
            createdObjCoords.height = y - createdObjCoords.startpointY - 1;
          }
          // createdObjCoords.width = x - createdObjCoords.left;
          // createdObjCoords.height = y - createdObjCoords.top;

          createdObjCoords.endpointX = x;
          createdObjCoords.endpointY = y;

          activeObjOnFCanv = updateCreatedObjOnMouseMove(
            fabricCanvas,
            activeObjOnFCanv,
            createdObjCoords,
            null,
            createdObjType
          );

          // console.log(createdObjCoords);

          // createdObjCoords = { left: 0, top: 0, width: 1, height: 1 };
        }
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
    createdObjType = this.props.toolSelected.toolOfElements.tool;
    console.log("-------Render-------");
    return (
      <div className="canvPlace">
        <canvas ref={this.refCanv} id="canv" />
      </div>
    );
  }
}

export default CanvasComponent;
