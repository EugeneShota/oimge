import React from "react";

import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

import "./Header.css";

function FileInfo() {
  return (
    <div className="fileInfo">
      <Spinner animation="border" size="sm" variant="warning" />
      <span>Name:, size:, ext:</span>
    </div>
  );
}

export default FileInfo;
