import ReactDOM from "react-dom";
import { rawOpencerts } from "./fixtures/v2/opencerts";
import { certWithBadTemplateName, certWithNoTemplate } from "./fixtures/v2/certs-to-test-default-renderer";
import { driverLicense } from "./fixtures/v3/driverLicense";
import { svgEmbeddedDemoV2, svgHostedDemoV2 } from "./fixtures/v2/svgDemoV2";
import React from "react";
import { AppContainer } from "./container";

export const App: React.FunctionComponent = (): React.ReactElement => {
  return (
    <AppContainer
      documents={[
        { name: "OpenCerts (V2)", document: rawOpencerts, frameSource: "http://localhost:9000" },
        {
          name: "Mock certificate with misconfigured template (V2)",
          document: certWithBadTemplateName,
          frameSource: "http://localhost:9000",
        },
        {
          name: "Mock certificate with no Template (V2)",
          document: certWithNoTemplate,
          frameSource: "http://localhost:9000",
        },
        { name: "Driver License (V3)", document: driverLicense, frameSource: "http://localhost:9000" },
        { name: "Legacy (Penpal V4)", document: { id: "legacy" }, frameSource: "http://localhost:8080" },
        { name: "SVG Embedded Demo (V2)", document: svgEmbeddedDemoV2, frameSource: "" },
        { name: "SVG Hosted Demo (V2)", document: svgHostedDemoV2, frameSource: "" },
      ]}
    />
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
