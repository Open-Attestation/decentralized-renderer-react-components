import React from "react";
import { createRoot } from "react-dom/client";
import { FramedDocumentRenderer } from "../../src";
import { registry } from "./templates";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<FramedDocumentRenderer templateRegistry={registry} />);
