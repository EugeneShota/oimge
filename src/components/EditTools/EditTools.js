import React from "react";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";

import "./EditTools.css";

import { toggleClassInEl, oneActivBtn } from "../../main";
const TOOLS = [
  "brush",
  "rectangle",
  "circle",
  "rows",
  "line",
  "text",
  "cropp",
  "rectangle-attention",
  "circle-attention",
  "insert-img",
];

const COLOR_TOOLS = ["color", "border-color", "pipette", "gradient"];

export default class EditTools extends React.Component {
  createBtnTools(arrTools) {
    let bntArr = arrTools.map(function (item, index) {
      return (
        <div className="btn-tool" key={index} data-tool={item}>
          {index}
        </div>
      );
    });
    return bntArr;
  }

  selectTool(event) {
    let tool = event.target;
    if (tool.dataset.tool !== undefined) {
      let toolType = tool.dataset.tool;
      switch (toolType) {
        case "brush":
          console.log("tool: " + toolType);
          oneActivBtn(tool, "btn-tool-active");
          break;
        case "rectangle":
          console.log("tool: " + toolType);
          oneActivBtn(tool, "btn-tool-active");
          break;
        case "circle":
          console.log("tool: " + toolType);
          oneActivBtn(tool, "btn-tool-active");
          break;
        case "rows":
          console.log("tool: " + toolType);
          oneActivBtn(tool, "btn-tool-active");
          break;
        case "line":
          console.log("tool: " + toolType);
          oneActivBtn(tool, "btn-tool-active");
          break;
        case "text":
          console.log("tool: " + toolType);
          oneActivBtn(tool, "btn-tool-active");
          break;
        case "cropp":
          console.log("tool: " + toolType);
          oneActivBtn(tool, "btn-tool-active");
          break;
        case "rectangle-attention":
          console.log("tool: " + toolType);
          oneActivBtn(tool, "btn-tool-active");
          break;
        case "circle-attention":
          console.log("tool: " + toolType);
          oneActivBtn(tool, "btn-tool-active");
          break;
        case "insert-img":
          console.log("tool: " + toolType);
          oneActivBtn(tool, "btn-tool-active");
          break;
        case "color":
          console.log("tool: " + toolType);
          oneActivBtn(tool, "btn-tool-active");
          break;
        case "border-color":
          console.log("tool: " + toolType);
          oneActivBtn(tool, "btn-tool-active");
          break;
        case "pipette":
          console.log("tool: " + toolType);
          oneActivBtn(tool, "btn-tool-active");
          break;
        case "gradient":
          console.log("tool: " + toolType);
          oneActivBtn(tool, "btn-tool-active");
          break;
        default:
          console.log("unknow tool: " + toolType);
      }
      console.log("> " + event.target.dataset.tool);

      toggleClassInEl([tool], ["btn-tool-active"]);
      // tool.classList.toggle("btn-tool-active");
    }
  }

  selectETool(cb, event) {
    let tool = event.target;
    if (tool.dataset.tool !== undefined) {
      let toolType = tool.dataset.tool;

      console.log("> " + event.target.dataset.tool);
      oneActivBtn(tool, "btn-tool-active");
      toggleClassInEl([tool], ["btn-tool-active"]);
      this.props.setSelectedTool(toolType);
      // tool.classList.toggle("btn-tool-active");
    }
  }

  render() {
    return (
      <div>
        <div
          className="group-tools"
          onClick={this.selectETool.bind(this, this.props.setSelectedTool)}
        >
          {this.createBtnTools(TOOLS)}
        </div>
        <div
          className="group-tools"
          onClick={this.selectETool.bind(this, this.props.setSelectedTool)}
        >
          {this.createBtnTools(COLOR_TOOLS)}
        </div>
      </div>
    );
  }
}
