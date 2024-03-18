/* eslint-disable */

// Valid / Invalid urls
// v4 with Svg url with response and multibase
// v4 with Svg data and multibase
// v4 with Svg url with tampered response and no multibase
// v4 with Svg url with bad response and multibase
// v4 with Svg url with tampered response and multibase
// v4 with tampered Svg data
// v2 with Svg url with response and multibase

// import React from "react";
import { v4 } from "@govtechsg/open-attestation";
import { render } from "@testing-library/react";
import { SvgRenderer } from "./SvgRenderer";
import fs from "fs";
// import { UnsupportedRenderer } from "./UnsupportedRenderer";

const v4WithSvgUrlAndDigestMultibase = {
  // TODO: Update type to v4.OpenAttestationDocument
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: { identityProofType: v4.IdentityProofType.DNSDid, identifier: "example.openattestation.com" },
  },
  credentialStatus: { type: "OpenAttestationCredentialStatus", credentialStatusType: v4.CredentialStatusType.None },
  renderMethod: {
    id: "http://mockbucket.com/static/svg_test.svg",
    type: "SvgRenderingTemplate2023",
    name: "SVG Certificate",
    digestMultibase: "z2Z98fDGXMKgjxZpWNFBE2c8fRPH5dQ9Zc2Y15vDHLHdm",
    url: "https://ignorethisurlthisisjusttopasstheschemacheck.com",
    renderMethodType: v4.RenderMethodType.EmbeddedRenderer,
  },
  credentialSubject: {
    id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
    type: ["SvgExample"],
    course: { name: "SVG Basics Workshop", fromDate: "01/01/2024", endDate: "16/01/2024" },
    recipient: { name: "TAN CHEN CHEN" },
  },
};

describe("component SvgRenderer with 200 response", () => {
  //   const mockBlob = jest.fn().mockResolvedValueOnce({
  //     arrayBuffer: jest.fn().mockResolvedValueOnce("your array buffer data"),
  //   });

  const mockSvg = fs.readFileSync("./src/components/renderer/fixtures/example_cert.svg");
  const mockBlob = jest.fn().mockResolvedValue(new Blob([mockSvg], { type: "image/svg+xml" }));
  const mockResponse = { blob: mockBlob };
  global.fetch = jest.fn().mockResolvedValueOnce(mockResponse);

  it("should render correctly", () => {
    const svgRef = {
      current: null,
    };

    const svgUrl = v4WithSvgUrlAndDigestMultibase.renderMethod.id;

    const { getByText } = render(
      <SvgRenderer svgOrUrl={svgUrl} document={v4WithSvgUrlAndDigestMultibase} svgRef={svgRef} />
    );
    // const { getByText } = render(
    //   <UnsupportedRenderer attachment={{ type: "application/epub+zip", data: "", filename: "" }} />
    // );
    // expect(getByText("Rendering of this type of attachment is not supported.")).toBeDefined();
    // expect(getByText("Please check your mime-type: application/epub+zip")).toBeDefined();
  });
});
