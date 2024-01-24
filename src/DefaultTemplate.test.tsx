import { extractTemplateInfo } from "./DefaultTemplate";
import { v2, v3 } from "@govtechsg/open-attestation";

describe(`${extractTemplateInfo.name}`, () => {
  it("should return template info for v2 documents", () => {
    const document: v2.OpenAttestationDocument = {
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

    expect(extractTemplateInfo(document)).toStrictEqual({
      name: "foo",
      type: "EMBEDDED_RENDERER",
      url: "https://govtech-renderer.openattestation.com",
    });
  });

  it("should return template info for v3 documents", () => {
    const document: v3.OpenAttestationDocument = {
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

    expect(extractTemplateInfo(document)).toStrictEqual({
      name: "foo",
      type: "EMBEDDED_RENDERER",
      url: "https://govtech-renderer.openattestation.com",
    });
  });

  it("should return undefined if v3 template is missing", () => {
    const document: v3.OpenAttestationDocument = {
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

    expect(extractTemplateInfo(document)).toBeUndefined();
  });

  it("should return undefined if v2 template is missing", () => {
    const document: v2.OpenAttestationDocument = {
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

    expect(extractTemplateInfo(document)).toBeUndefined();
  });

  it("should return undefined if not valid OA document", () => {
    const document = {
      recipient: { name: "Tan Chen Chen" },
    } as v2.OpenAttestationDocument;

    expect(extractTemplateInfo(document)).toBeUndefined();
  });
});
