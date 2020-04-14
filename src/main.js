function toggleClassInEl(arrEl = [], arrCl = []) {
  if (arrEl.length > 0 && arrCl.length > 0) {
    // let el;
    if (arrEl.length === 1) {
      // el = arrEl[0];
      if (arrCl.length === 1) {
        arrEl[0].classList.toggle(arrCl[0]);
      } else {
        for (let i = 0; i < arrCl.length; i++) {
          arrEl[0].classList.toggle(arrCl[i]);
        }
      }
    } else {
      if (arrCl.length === 1) {
        for (let i = 0; i < arrEl.length; i++) {
          arrEl[i].classList.toggle(arrCl[0]);
        }
      } else {
        for (let i = 0; i < arrEl.length; i++) {
          for (let j = 0; j < arrCl.length; j++) {
            arrCl[i].classList.toggle(arrCl[j]);
          }
        }
      }
    }
  }
}

function oneActivBtn(activEl, clName) {
  let parentEl = activEl.parentNode;
  let siblingEl = parentEl.childNodes;
  for (let i = 0; i < siblingEl.length; i++) {
    if (siblingEl[i] === activEl) {
      toggleClassInEl([]);
    } else {
      siblingEl[i].classList.remove(clName);
    }
  }
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
  };
}

export { toggleClassInEl, oneActivBtn, setInitImg };
