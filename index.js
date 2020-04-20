// import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./testsass.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// function InitCanvas(path){
//   let canvas=document.querySelector('#editAr'),
//   context=canvas.getContext("2d");
//
//   var initImg=new Image();
//   initImg.src=path;
//
//   initImg.onload= function(){
//     let pattern=context.createPattern(initImg,"repeat");
//     context.fillStyle=pattern;
//       // context.strokeRect(50,40,100,100);
//       // context.fillRect(170,40,100,100);
//   }
//
// };
// InitCanvas(iimg);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
