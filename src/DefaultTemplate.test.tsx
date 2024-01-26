import React from "react";
import { extractTemplateInfo, NoTemplate, WrongTemplate, ConnectionFailureTemplate } from "./DefaultTemplate";
import { v2, v3 } from "@govtechsg/open-attestation";
import { render } from "@testing-library/react";

const v2Document: v2.OpenAttestationDocument = {
  recipient: { name: "Tan Chen Chen" },
  issuers: [
    {
      id: "did:ethr:mockHashValue",
      name: "GovTech Singapore",
      identityProof: {
        type: v2.IdentityProofType.DNSDid,
        location: "staging.notarise.io",
        key: "did:ethr:mockHashValue#controller",
      },
    },
  ],
  $template: {
    name: "foo",
    type: v2.TemplateType.EmbeddedRenderer,
    url: "https://govtech-renderer.openattestation.com",
  },
};

const v3Document: v3.OpenAttestationDocument = {
  credentialSubject: { id: "did:example:ebfeb1f712ebc6f1c276e12ec21", name: "Tan Chen Chen" },
  issuer: {
    id: "did:ethr:mockHashValue",
    name: "https://example.com",
  },
  issuanceDate: "2010-01-01T19:23:24Z",
  openAttestationMetadata: {
    identityProof: {
      type: v3.IdentityProofType.DNSDid,
      identifier: "mockId",
    },
    proof: {
      method: v3.Method.Did,
      type: v3.ProofType.OpenAttestationProofMethod,
      value: "mockProofValue",
    },
    template: {
      url: "https://govtech-renderer.openattestation.com",
      name: "foo",
      type: v3.TemplateType.EmbeddedRenderer,
    },
  },
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
  ],
  type: ["VerifiableCredential", "OpenAttestationCredential"],
};

const v3DocumentNoTemplate: v3.OpenAttestationDocument = {
  credentialSubject: { id: "did:example:ebfeb1f712ebc6f1c276e12ec21", name: "Tan Chen Chen" },
  issuer: {
    id: "did:ethr:mockHashValue",
    name: "https://example.com",
  },
  issuanceDate: "2010-01-01T19:23:24Z",
  openAttestationMetadata: {
    identityProof: {
      type: v3.IdentityProofType.DNSDid,
      identifier: "mockId",
    },
    proof: {
      method: v3.Method.Did,
      type: v3.ProofType.OpenAttestationProofMethod,
      value: "mockProofValue",
    },
  },
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
  ],
  type: ["VerifiableCredential", "OpenAttestationCredential"],
};

const v2DocumentNoTemplate: v2.OpenAttestationDocument = {
  recipient: { name: "Tan Chen Chen" },
  issuers: [
    {
      id: "did:ethr:mockHashValue",
      name: "GovTech Singapore",
      identityProof: {
        type: v2.IdentityProofType.DNSDid,
        location: "staging.notarise.io",
        key: "did:ethr:mockHashValue#controller",
      },
    },
  ],
};

describe(`${extractTemplateInfo.name}`, () => {
  it("should return template info for v2 documents", () => {
    expect(extractTemplateInfo(JSON.parse(JSON.stringify(v2Document)))).toStrictEqual({
      name: "foo",
      type: "EMBEDDED_RENDERER",
      url: "https://govtech-renderer.openattestation.com",
    });
  });

  it("should return template info for v3 documents", () => {
    expect(extractTemplateInfo(JSON.parse(JSON.stringify(v3Document)))).toStrictEqual({
      name: "foo",
      type: "EMBEDDED_RENDERER",
      url: "https://govtech-renderer.openattestation.com",
    });
  });

  it("should return undefined if v3 template is missing", () => {
    expect(extractTemplateInfo(JSON.parse(JSON.stringify(v3DocumentNoTemplate)))).toBeUndefined();
  });

  it("should return undefined if v2 template is missing", () => {
    expect(extractTemplateInfo(JSON.parse(JSON.stringify(v2DocumentNoTemplate)))).toBeUndefined();
  });

  it("should return undefined if not valid OA document", () => {
    const document = {
      recipient: { name: "Tan Chen Chen" },
    } as v2.OpenAttestationDocument;

    expect(extractTemplateInfo(document)).toBeUndefined();
  });
});

describe(`test default renderers`, () => {
  it("should display the correct error messages for a document with no template", () => {
    const screen = render(
      <NoTemplate
        document={JSON.parse(JSON.stringify(v2DocumentNoTemplate))}
        handleObfuscation={(value) => {
          return value;
        }}
      />
    );
    expect(screen.getByText("This document is displayed in plain text")).toBeDefined();
    expect(
      screen.getByText("As this document does not have a template, the current display is intended.")
    ).toBeDefined();
    expect(screen.queryByTestId("template-info")).toBeNull();
    expect(screen.getByTestId("json-view")).toBeDefined();
  });

  it("should display the correct error messages for a document with wrong template", () => {
    const screen = render(
      <WrongTemplate
        document={JSON.parse(JSON.stringify(v2Document))}
        handleObfuscation={(value) => {
          return value;
        }}
      />
    );
    expect(screen.getByText("This document has display issues")).toBeDefined();
    expect(
      screen.getByText(
        "An incorrect template has been used for this document. Please contact the issuer with the information below:"
      )
    ).toBeDefined();
    expect(screen.queryByTestId("template-info")).toBeDefined();
    expect(screen.getByTestId("json-view")).toBeDefined();
  });

  it("should display the correct error messages during timeout", () => {
    const screen = render(
      <ConnectionFailureTemplate document={JSON.parse(JSON.stringify(v2Document))} source={"someurl"} />
    );
    expect(screen.getByText("This document might be having loading issues")).toBeDefined();
    expect(
      screen.getByText(
        "Try refreshing the page or check your internet connection. If the issue continues, please contact the issuer with the information below:"
      )
    ).toBeDefined();
    expect(screen.queryByTestId("template-info")).toBeDefined();
    expect(screen.getByTestId("json-view")).toBeDefined();
  });

  it("should not display the template info if timeout on a document without template", () => {
    const screen = render(
      <ConnectionFailureTemplate document={JSON.parse(JSON.stringify(v2DocumentNoTemplate))} source={"someurl"} />
    );
    expect(screen.getByText("This document might be having loading issues")).toBeDefined();
    expect(
      screen.getByText(
        "Try refreshing the page or check your internet connection. If the issue continues, please contact the issuer with the information below:"
      )
    ).toBeDefined();
    expect(screen.queryByTestId("template-info")).toBeNull();
    expect(screen.getByTestId("json-view")).toBeDefined();
  });
});
