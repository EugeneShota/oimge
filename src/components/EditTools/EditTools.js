import React from "react";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";

import "./EditTools.css";

import { toggleClassInEl, oneActivBtn } from "../../main";

const TOOLS_OF_SELECT = ["simple-select", "group-select"];

const TOOLS_OF_ELEMENTS = [
  "rectangle",
  "ellipse",
  "line",
  "text",
  "brush",
  "rows",
  "cropp",
  "rectangle-attention",
  "ellipse-attention",
  "insert-img",
];

const TOOLS_OF_APPEARANCE = ["color", "border-color", "pipette", "gradient"];

const NOT_MULTI_ACTIVE_TOOL = ["toolOfElements", "toolOfSelect"];

let activeTools, prevTools;
export default class EditTools extends React.Component {
  createBtnTools(arrTools, toolOf) {
    let bntArr = arrTools.map(function (item, index) {
      return (
        <div
          className="btn-tool"
          key={index}
          data-tool={item}
          data-toolof={toolOf}
          title={item}
        >
          {index}
        </div>
      );
    });
    return bntArr;
  }

  // selectTool(event) {
  //   let tool = event.target;
  //   if (tool.dataset.tool !== undefined) {
  //     let toolType = tool.dataset.tool;
  //     switch (toolType) {
  //       case "brush":
  //         console.log("tool: " + toolType);
  //         oneActivBtn(tool, "btn-tool-active");
  //         break;
  //       case "rectangle":
  //         console.log("tool: " + toolType);
  //         oneActivBtn(tool, "btn-tool-active");
  //         break;
  //       case "circle":
  //         console.log("tool: " + toolType);
  //         oneActivBtn(tool, "btn-tool-active");
  //         break;
  //       case "rows":
  //         console.log("tool: " + toolType);
  //         oneActivBtn(tool, "btn-tool-active");
  //         break;
  //       case "line":
  //         console.log("tool: " + toolType);
  //         oneActivBtn(tool, "btn-tool-active");
  //         break;
  //       case "text":
  //         console.log("tool: " + toolType);
  //         oneActivBtn(tool, "btn-tool-active");
  //         break;
  //       case "cropp":
  //         console.log("tool: " + toolType);
  //         oneActivBtn(tool, "btn-tool-active");
  //         break;
  //       case "rectangle-attention":
  //         console.log("tool: " + toolType);
  //         oneActivBtn(tool, "btn-tool-active");
  //         break;
  //       case "circle-attention":
  //         console.log("tool: " + toolType);
  //         oneActivBtn(tool, "btn-tool-active");
  //         break;
  //       case "insert-img":
  //         console.log("tool: " + toolType);
  //         oneActivBtn(tool, "btn-tool-active");
  //         break;
  //       case "color":
  //         console.log("tool: " + toolType);
  //         oneActivBtn(tool, "btn-tool-active");
  //         break;
  //       case "border-color":
  //         console.log("tool: " + toolType);
  //         oneActivBtn(tool, "btn-tool-active");
  //         break;
  //       case "pipette":
  //         console.log("tool: " + toolType);
  //         oneActivBtn(tool, "btn-tool-active");
  //         break;
  //       case "gradient":
  //         console.log("tool: " + toolType);
  //         oneActivBtn(tool, "btn-tool-active");
  //         break;
  //       default:
  //         console.log("unknow tool: " + toolType);
  //     }
  //     console.log("> " + event.target.dataset.tool);

  //     toggleClassInEl([tool], ["btn-tool-active"]);
  //     // tool.classList.toggle("btn-tool-active");
  //   }
  // }

  selectETool(cb, event) {
    let tool = event.target;
    console.log("select: " + tool.dataset.toolof + " " + tool.dataset.tool);

    if (tool.dataset.tool !== undefined && tool.dataset.toolof !== undefined) {
      if (NOT_MULTI_ACTIVE_TOOL.includes(tool.dataset.toolof)) {
      }
      let toolType = tool.dataset.tool;
      console.log("!==undef");

      if (
        tool.dataset.tool === activeTools[tool.dataset.toolof].tool ||
        tool.dataset.tool === prevTools
      ) {
        console.log(
          activeTools[tool.dataset.toolof].tool + "===" + tool.dataset.tool
        );

        return;
      }
      prevTools = tool.dataset.tool;
      console.log("> " + tool.dataset.tool);
      oneActivBtn(tool, "btn-tool-active", NOT_MULTI_ACTIVE_TOOL);
      toggleClassInEl([tool], ["btn-tool-active"]);
      cb(tool.dataset.tool, tool.dataset.toolof);
      // this.props.setSelectedTool(toolType);
      // tool.classList.toggle("btn-tool-active");
      //toolOfElements
    }
  }

  activateTools(tools) {
    let btnTools = document.querySelectorAll(".btn-tool");
    console.log(btnTools);
    let toolOfElements = tools.toolOfElements.tool,
      toolOfAppearance = tools.toolOfAppearance.tool;
    // toolOfSelect = tools.toolOfSelect.tool;
    let countActiveBtn = 0,
      activeTool;

    for (let i = 0; i < btnTools.length; i++) {
      console.log(btnTools[i]);

      if (btnTools[i].dataset.tool === toolOfElements) {
        toggleClassInEl([btnTools[i]], ["btn-tool-active"]);
        activeTool = btnTools[i];
        countActiveBtn++;
      }

      if (btnTools[i].dataset.tool === toolOfAppearance) {
        // oneActivBtn(btnTools[i], "btn-tool-active");
        toggleClassInEl([btnTools[i]], ["btn-tool-active"]);
        countActiveBtn++;
      }
      // if (btnTools[i].dataset.tool === toolOfSelect) {
      //   toggleClassInEl([btnTools[i]], ["btn-tool-active"]);
      //   countActiveBtn++;
      // }
      if (countActiveBtn === 2) return activeTool;
    }
  }

  componentDidMount() {
    prevTools = this.activateTools(activeTools);
  }

  render() {
    activeTools = this.props.toolSelected;
    return (
      <div>
        <div
          className="group-tools"
          onClick={this.selectETool.bind(this, this.props.setSelectedTool)}
        >
          {this.createBtnTools(TOOLS_OF_SELECT, "toolOfSelect")}
        </div>
        <div
          className="group-tools"
          onClick={this.selectETool.bind(this, this.props.setSelectedTool)}
        >
          {this.createBtnTools(TOOLS_OF_ELEMENTS, "toolOfElements")}
        </div>
        <div
          className="group-tools"
          onClick={this.selectETool.bind(this, this.props.setSelectedTool)}
        >
          {this.createBtnTools(TOOLS_OF_APPEARANCE, "toolOfAppearance")}
        </div>
      </div>
    );
  }
}
