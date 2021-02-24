import ReactDOM from "react-dom";
import { rawOpencerts } from "./fixtures/v2/opencerts";
import React from "react";
import { AppContainer } from "./container";

ReactDOM.render(
  <AppContainer documents={[{ name: "Default document", document: rawOpencerts }]} />,
  document.getElementById("root")
);
