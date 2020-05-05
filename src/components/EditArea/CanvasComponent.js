import React from "react";
// import ReactDOM from "react-dom";
import { fabric } from "fabric/dist/fabric.min.js";
import { act } from "react-dom/test-utils";

// import { setInitImg } from "../../main.js";

let fabricCanvas;
let creationObject;
let activeObjOnFCanv = null;
let createdObjType = "rectangle",
  toolOfSelect = "",
  toolOfAppearance = "";

let prevToolIsSelection = false;

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

let createdObjStyle = {
  fill: "orange", //fillColor
  stroke: "green", //strokeColor
  selectable: false,
};

let rectAtt = [];
let actualRectAtt = null;

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
  isUpdated = false,
  funcParam = null
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
      if (funcParam == null) {
        console.log("funcParam !== undefined - addRect");
        activeObjOnFCanv = addRectToFCanv(fCanvas, coords, {
          fill: null,
          stroke: "orange",
          selectable: false,
        });
      }
      if (isUpdated) {
        console.log("isUpdated");
        let tempObj;
        if (funcParam !== null) {
          console.log("funcParam !== null - addPath(funcParam)");
          // console.warn(...funcParam);
          tempObj = addPathToFCanv(fCanvas, funcParam);
        } else {
          console.log("funcParam !!== null - addPath");
          tempObj = addPathToFCanv(fCanvas, {
            coords,
            style,
            borderObj: activeObjOnFCanv,
            actualRectAtt,
            rectAttArr: rectAtt,
          });
        }

        activeObjOnFCanv = tempObj.newRectAtt;
        actualRectAtt = tempObj.newRectAtt;
        rectAtt = tempObj.rectAttArr;
        console.log("actualRectAtt" + actualRectAtt);
        // console.log(">" + actualRectAtt + " ~ " + rectAtt);
      }
      break;
    case "ellipse-attention":
      activeObjOnFCanv = addEllipseToFCanv(fCanvas, coords, style, true);
      break;
    case "simple-select":
      break;
    case "group-select":
      break;
    case "": //если выбран инструмент выделения
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
        // console.log(coords);
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

function addRectAtt(targetEl, fCanvas, funcParam) {
  // console.log("////" + elem.id_borderRectAtt);

  let { rectAtt: rectAttArr, actualRectAtt } = funcParam;
  let { left, top, width, height } = targetEl;

  let newRectPath =
    "M" +
    (left + width) +
    "," +
    (top + height) +
    "H" +
    left +
    "v-" +
    height +
    "h" +
    width +
    "V" +
    (top + height) +
    "z";

  // rectAttArray[elem.id_borderRectAtt] = newRectPath;
  createObjOnFCanv(
    fCanvas,
    { left, top, width, height },
    {},
    "rectangle-attention",
    true,
    {
      coords: { left, top, width, height },
      style: {},
      borderObj: targetEl,
      actualRectAtt,
      rectAttArr,
    }
  );
}

function addEventToElement(
  fCanvas,
  elementF,
  func,
  eventEL = "mouse:down",
  funcParam
) {
  if (fCanvas && elementF && func) {
    elementF.on(eventEL, func.bind(this, fCanvas, funcParam));
    fCanvas.renderAll();
  } else {
    console.error("addEventToElement");
  }
}

function addRectToFCanv(fCanvas, coords, style, shadow = false) {
  // let rectF = new fabric.Rect({
  //   left: coords.left,
  //   top: coords.top,
  //   fill: style.fillColor,
  //   stroke: style.strokeColor,
  //   width: coords.width,
  //   height: coords.height,
  // });
  let rectF = new fabric.Rect({ ...coords, ...style });
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
    ...style,
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
      ...style,
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
    left: coords.endpointX,
    top: coords.endpointY,
    fontSize: 20,
    ...style,
  });
  fCanvas.add(textF);
  return textF;
}

function addPathToFCanv(fCanvas, funcParam) {
  //передавать тип(прямоугольник\круг) и объект - брать размеры
  // если ничего не переданно - создаем прямоугольник\круг
  // в зависимости от типа

  let { coords, style, borderObj, actualRectAtt, rectAttArr } = funcParam;
  console.log("=== border object: " + borderObj);

  console.log("fCanvas>>> " + fCanvas);
  let canvPath = "M0,0v" + fCanvas.height + "h" + fCanvas.width + "V0H0z";

  let { scaleX, scaleY } = borderObj;
  let width = coords.width * scaleX,
    height = coords.height * scaleY;
  let path21 =
    "M" +
    (coords.left + width) +
    "," +
    (coords.top + height) +
    "H" +
    coords.left +
    "v-" +
    height +
    "h" +
    width +
    "V" +
    (coords.top + height) +
    "z";

  console.log("rectAttArr" + rectAttArr);

  rectAttArr[
    borderObj.id_borderRectAtt !== undefined
      ? borderObj.id_borderRectAtt
      : rectAttArr.length
  ] = path21;

  let groupRectAttPath = "";
  for (let i = 0; i < rectAttArr.length; i++) {
    groupRectAttPath += rectAttArr[i] + " ";
  }

  let finalyPath = "<svg><path d='" + canvPath + groupRectAttPath + "'/></svg>";
  // console.log(finalyPath);

  let newRectAtt;

  fabric.loadSVGFromString(finalyPath, (objects, options) => {
    let obj = fabric.util.groupSVGElements(objects, options);
    obj.set({
      isPathRectAtt: true,
      opacity: 0.65,
      selectable: false,
      lockRotation: true,
    });

    if (borderObj.id_borderRectAtt === undefined) {
      borderObj.set({
        id_borderRectAtt: rectAttArr.length - 1,
        lockRotation: true,
      });
    }

    fCanvas.remove(actualRectAtt);
    fCanvas.add(obj);
    obj.moveTo(0);
    // let groupRectAtt = new fabric.Group([borderObj, obj]);
    // fCanvas.remove(borderObj);
    // fCanvas.add(groupRectAtt);

    // fCanvas.renderAll();

    newRectAtt = obj;
  });

  // console.log(">>> rectAtt: " + rectAttArr);
  // console.log(newRectAtt);

  // let pathF = new fabric.Path(path2, { opacity: 0.5, selectable: false });

  // borderObj.on("modified", (options) => {
  //   alert(options + " - " + fCanvas.getActiveObject());
  // });
  return { newRectAtt, rectAttArr };
}

function freeDrawingToFCanv(fCanvas, style) {
  if (fCanvas) {
    fCanvas.isDrawingMode = true;
    // console.log("color: >" + new fabric.Color("#787878").toRgb());
    fCanvas.freeDrawingBrush.color = style.fill;
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
  // console.log(">>>>srcIMG (setInitImg): " + srcImg);
  img.crossOrigin = "Anonymous";
  img.src = srcImg; //"../public/noIMG.png"
  img.onload = function () {
    // console.log("setInitImg: " + srcImg);
    // console.log("width: " + img.width + ", height: " + img.height);
    let { aspectRatio, newWidth, newHeight } = calcAspRatio(img, width, height);
    let { scaleX, scaleY } = calcScale(img, width, height);
    // определение начальной точки для вставки изображения
    let startDrawImgWidth = (newWidth - img.width * scaleY) / 2,
      startDrawImgHeight = (img.height - newHeight) / 2;

    // console.log(
    //   ">>> srcImg: " + srcImg + " startDrawImgWidth:" + startDrawImgWidth
    // );

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

function removeObjOnFCanv(fCanvas) {
  let activeObj = fCanvas.getActiveObjects();
  fCanvas.discardActiveObject();
  for (let i = 0; i < activeObj.length; i++) {
    fCanvas.remove(activeObj[i]);
  }
  fCanvas.renderAll();
}

class CanvasComponent extends React.Component {
  constructor(props) {
    super(props);
    this.refCanv = React.createRef();
  }

  componentDidMount() {
    // alert("CanvComp componentDidMount()");
    document
      .querySelector("#canvContainer")
      .addEventListener("keydown", (event) => {
        console.log("CanvComp - Press: " + event);
        removeObjOnFCanv(fabricCanvas);
      });

    this.mountFabricCanvas(this.props.imgPath);
  }

  componentDidUpdate(prevProps) {
    // alert("CanvComp componentDidUpdate()");
    //переделать
    // this.initFabricCanvas(this.props.imgPath);
    if (prevToolIsSelection) {
      if (toolOfSelect === "") {
        this.toggleSelectableObjFCanv(fabricCanvas, toolOfSelect, false, true);
        prevToolIsSelection = false;
      } else {
        this.toggleSelectableObjFCanv(fabricCanvas, toolOfSelect, true);
      }
    } else if (toolOfSelect !== "") {
      this.toggleSelectableObjFCanv(fabricCanvas, toolOfSelect);
      prevToolIsSelection = true;
      // return;
    }

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

  isReadyToCreate(typeCall, tools, target, activeObjOnFCanv) {
    // if (
    //   tools.toolOfSelect.tool === "simple-select" &&
    //   typeCall === "mouse:move"
    // ) {
    //   if (
    //     activeObjOnFCanv !== null &&
    //     activeObjOnFCanv.id_borderRectAtt !== undefined
    //   )
    //     return true;

    //     activeObjOnFCanv.isPathRectAtt !== undefined;
    // }

    if (
      tools.toolOfSelect.tool !== "" ||
      tools.toolOfElements.tool === "brush"
    ) {
      return false;
    }

    if (typeCall === "mouse:down" || typeCall === "mouse:up") {
      return true;
    }

    if (typeCall === "mouse:move") {
      // if (
      //   (target !== null && target.id_borderRectAtt !== undefined) ||
      //   (activeObjOnFCanv !== null && activeObjOnFCanv.type === "path")
      // ) {
      //   return false;
      // }
      if (activeObjOnFCanv !== null && activeObjOnFCanv.type !== "path") {
        return true;
      }
    }
    return false;
  }

  toggleSelectableObjFCanv(
    fCanvas,
    typeToolOfSelect = "",
    selectToSelect = false,
    selectToElement = false
  ) {
    let objectsFCanv = fCanvas.getObjects();

    if (fCanvas.getActiveObjects().length > 0) {
      fCanvas.discardActiveObject();
      fCanvas.renderAll();
    }

    if (selectToSelect) {
      fabricCanvas.discardActiveObject();

      for (let i = 0; i < objectsFCanv.length; i++) {
        if (objectsFCanv[i].id_borderRectAtt === undefined) {
          continue;
        }
        objectsFCanv[i].set(
          "selectable",
          typeToolOfSelect === "group-select" ? false : true
        );
      }

      fabricCanvas.selection =
        typeToolOfSelect === "group-select" ? true : false;
      fabricCanvas.renderAll();

      return;
    }

    if (typeToolOfSelect === "group-select") {
      fCanvas.selection = true;
    } else {
      fCanvas.selection = false;
    }
    console.log(objectsFCanv);

    for (let i = 0; i < objectsFCanv.length; i++) {
      if (
        (objectsFCanv[i].id_borderRectAtt !== undefined &&
          typeToolOfSelect === "group-select") ||
        objectsFCanv[i].isPathRectAtt !== undefined
      ) {
        continue;
      }
      objectsFCanv[i].set(
        "selectable",
        selectToElement ? false : !objectsFCanv[i].selectable
      );
    }
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
      // console.log("fabricCanvas - true");
      // fabricCanvas = this.props.fabricCanvas;
    } else {
      fabricCanvas = new fabric.Canvas("canv");

      fabricCanvas.selection = false; //group selection disable

      fabricCanvas.on("mouse:down", (options) => {
        // console.log(">> mouse-down: " + fabricCanvas.getPointer());
        // console.log("~~~~ options.target " + options.target);
        // console.log("}options" + options.e);
        console.log(document.activeElement);
        if (
          this.isReadyToCreate(
            "mouse:down",
            this.props.toolSelected,
            options.target,
            activeObjOnFCanv
          )
        ) {
          if (true) {
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
            // console.log(createdObjCoords);
          } else {
            // console.log(options.target.type + "<<<");
          }
        }
      });

      fabricCanvas.on("mouse:up", (options) => {
        // console.log(
        //   ">> mouse-up: " + options.e.clientX + "x" + options.e.clientY
        // );
        // console.log("target: " + fabricCanvas.getPointer());

        if (
          this.isReadyToCreate(
            "mouse:up",
            this.props.toolSelected,
            options.target,
            activeObjOnFCanv
          )
        ) {
          if (true) {
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

            // console.log(createdObjCoords);

            createdObjCoords = { left: 0, top: 0, width: 1, height: 1 };
          }
        }
      });

      fabricCanvas.on("mouse:move", (options) => {
        // console.log(
        //   ">> mouse-move: " + options.e.clientX + "x" + options.e.clientY
        // );

        if (
          this.isReadyToCreate(
            "mouse:move",
            this.props.toolSelected,
            options.target,
            activeObjOnFCanv
          )
        ) {
          let { clientX: x, clientY: y } = checkClientCoords(
            fabricCanvas.getPointer()
          );
          console.log(">MOVE< activeObjOnFCanv: " + activeObjOnFCanv);
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

          updateCreatedObjOnMouseMove(
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

      fabricCanvas.on("object:moving", (options) => {
        if (options.target.id_borderRectAtt !== undefined) {
          if (true) {
            fabricCanvas.remove(actualRectAtt);
            // actualRectAtt = null;
          }
          // testFunct(options.target, fabricCanvas, rectAtt, actualRectAtt);
        }
      });

      fabricCanvas.on("object:scaling", (options) => {
        // console.log("--Scaling--");
        if (options.target.id_borderRectAtt !== undefined) {
          console.log(options.target.scaleX);
          fabricCanvas.remove(actualRectAtt);
        }
      });

      fabricCanvas.on("object:scaled", (options) => {
        // console.log("--Scaled--");
        if (options.target.id_borderRectAtt !== undefined) {
          console.log("--Scaled RectAtt--");
          addRectAtt(options.target, fabricCanvas, { rectAtt, actualRectAtt });
        }
      });

      fabricCanvas.on("object:moved", (options) => {
        console.log("--moved--");
        if (options.target.id_borderRectAtt !== undefined) {
          console.log("-- moved RectAtt --");
          console.log("actualRectAtt " + actualRectAtt);
          addRectAtt(options.target, fabricCanvas, { rectAtt, actualRectAtt });
          // fabricCanvas.renderAll();
        }
        console.log(actualRectAtt);
      });

      fabricCanvas.on("path:created", (options) => {
        options.path.set("selectable", false);
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
    toolOfSelect = this.props.toolSelected.toolOfSelect.tool;
    toolOfAppearance = this.props.toolSelected.toolOfAppearance.tool;
    if (createdObjType) {
    }
    console.log("-------Render-------");
    return (
      <div id="canvContainer" className="canvPlace">
        <canvas ref={this.refCanv} id="canv" />
      </div>
    );
  }
}

export default CanvasComponent;
