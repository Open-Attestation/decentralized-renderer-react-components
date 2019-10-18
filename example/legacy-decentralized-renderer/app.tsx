import React from "react";
import ReactDOM from "react-dom";
import { registry } from "../decentralized-renderer/templates";
import { LegacyFramedDocumentRenderer } from "../../src/components/renderer/LegacyFramedDocumentRenderer";

ReactDOM.render(<LegacyFramedDocumentRenderer templateRegistry={registry} />, document.getElementById("root"));
