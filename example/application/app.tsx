import ReactDOM from "react-dom";
import { rawOpencerts } from "./fixtures/v2/opencerts";
import { driverLicense } from "./fixtures/v3/driverLicense";
import React from "react";
import { AppContainer } from "./container";

export const App: React.FunctionComponent = (): React.ReactElement => {
  return (
    <AppContainer
      documents={[
        { name: "OpenCerts (v2)", document: rawOpencerts, frameSource: "http://localhost:9000" },
        { name: "Driver License (V3)", document: driverLicense, frameSource: "http://localhost:9000" },
        { name: "Legacy (Penpal V4)", document: { id: "legacy" }, frameSource: "http://localhost:8080" }
      ]}
    />
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
