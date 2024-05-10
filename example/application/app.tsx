import ReactDOM from "react-dom";
import { rawOpencerts } from "./fixtures/v2/opencerts";
import { certWithBadTemplateName, certWithNoTemplate } from "./fixtures/v2/certs-to-test-default-renderer";
import { driverLicense } from "./fixtures/v3/driverLicense";
import { malformSvgDemoV2, svgEmbeddedDemoV2, svgHostedDemoV2 } from "./fixtures/v2/svgDemoV2";
import React from "react";
import { AppContainer } from "./container";
import { v4 } from "@govtechsg/open-attestation";

export const App: React.FunctionComponent = (): React.ReactElement => {
  return (
    <AppContainer
      documents={[
        { name: "OpenCerts (V2) 1", document: rawOpencerts, frameSource: "http://localhost:9000" },
        {
          name: "OpenCerts (V2) 2",
          document: {
            ...rawOpencerts,
            recipient: {
              name: "Your Name 2",
              nric: "SXXXXXXXY 2",
              course: "Govtech Demo 2",
            },
          },
          frameSource: "http://localhost:9000",
        },
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
        {
          name: "SVG Embedded Demo (V4)",
          document: {
            "@context": [
              "https://www.w3.org/ns/credentials/v2",
              "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
            ],
            type: ["VerifiableCredential", "OpenAttestationCredential"],
            validFrom: "2021-03-08T12:00:00+08:00",
            name: "Republic of Singapore Driving Licence",
            issuer: {
              id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
              type: "OpenAttestationIssuer",
              name: "Government Technology Agency of Singapore (GovTech)",
              identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
            },
            renderMethod: [
              {
                id: `<svg width="340" height="110" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="330" height="100" fill="#d4d4d4" stroke="orange" stroke-width="8" rx="10" ry="10" />
                <text x="170" y="45" font-family="Arial" font-size="15" fill="black" text-anchor="middle">Congratulations for achieving {{qualification}}!</text>
                <text x="170" y="70" font-family="Arial" font-size="12" fill="black" text-anchor="middle">Awarded to: {{recipient.name}}</text>
                </svg>`,
                type: "SvgRenderingTemplate2023",
                name: "SVG Demo",
              },
            ],
            credentialSubject: {
              qualification: "SVG rendering",
              recipient: {
                name: "Yourself",
              },
            },
          } as v4.Document,
          frameSource: "",
        },
        { name: "SVG Embedded Demo (V2)", document: svgEmbeddedDemoV2, frameSource: "" },
        { name: "Malformed SVG (V2)", document: malformSvgDemoV2, frameSource: "" },
        { name: "SVG Hosted Demo (V2)", document: svgHostedDemoV2, frameSource: "" },
      ]}
    />
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
