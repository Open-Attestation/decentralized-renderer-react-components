import React from "react";
import ReactDOM from "react-dom";
import { FramedDocumentRenderer } from "../../src/components/renderer/FramedDocumentRenderer";
import { registry } from "./templates";

ReactDOM.render(<FramedDocumentRenderer templateRegistry={registry} />, document.getElementById("root"));
