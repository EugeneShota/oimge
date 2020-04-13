import React from "react";
// import SrcImg from "./noIMG.png";
import { setInitImg } from "../../main.js";
// const CANVAS_SIZE = [800, 1000, 1200, 1300];

function rect(props) {
  const { ctx, x, y, width, height } = props;
  ctx.fillRect(x, y, width, height);
}

// function setInitImg(props) {
//   const { ctx, srcImg, typeRepeat, width, height } = props;
//   let img = new Image();
//   img.src = "../../../public/noIMG.png";
//   console.log("setInitImg: " + srcImg);
//   console.log(img.width);
//   console.log(img.height);
//   let aspectRatio = (img.width / img.height).toFixed(15);
//   console.log("acpRatio " + aspectRatio);
//   if (img.height > img.width || img.height > height) {
//     console.log("if");
//     img.height = img.height > height ? height : img.height;
//     img.width = img.height * aspectRatio;
//   } else {
//     console.log("else");
//     img.width = img.width > width ? width : img.width;
//     img.height = img.width / aspectRatio;
//   }
//   console.log("width: " + img.width);
//   console.log("height: " + img.height);
//   let startDrawImgWidth = (width - img.width) / 2,
//     startDrawImgHeight = (height - img.height) / 2;
//   img.onload = function () {
//     var pattern = ctx.createPattern(img, typeRepeat);
//     ctx.fillStyle = pattern;
//     ctx.drawImage(
//       img,
//       startDrawImgWidth,
//       startDrawImgHeight,
//       img.width,
//       img.height
//     );
//     // ctx.fillRect(20,20,500,500);
//     // rect({ctx, x: 20, y: 20, width, height});
//   };
// }

class CanvasComponent extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
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
    const canvasR = this.refs.canvas;
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
    // rect({ ctx, x: 10, y: 10, width: 100, height: 100 });
    // rect({ ctx, x: 610, y: 10, width: 50, height: 50 });
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
        <canvas ref="canvas" id="canv" />
      </div>
    );
  }
}

export default CanvasComponent;
