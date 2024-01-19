import { v2 } from "@govtechsg/open-attestation";

export const misconfiguredCert = {
  message: "Sample OA document",
  recipient: {
    name: "Tan Chen Chen",
  },
  $template: {
    name: "NO_MATCHING_NAME",
    type: v2.TemplateType.EmbeddedRenderer,
    url: "https://govtech-renderer.openattestation.com",
  },
  issuers: [
    {
      id: "did:ethr:0x3A655e6EdeBcDf1e7d69195dFf2AeA5fE126bC6E",
      name: "GovTech Singapore",
      revocation: {
        type: "NONE",
      },
      identityProof: {
        type: ":DNS-DID",
        location: "staging.notarise.io",
        key: "did:ethr:0x3A655e6EdeBcDf1e7d69195dFf2AeA5fE126bC6E#controller",
      },
    },
  ],
};

export const missingTemplate = {
  message: "Sample OA document",
  recipient: {
    name: "Tan Chen Chen",
  },
  issuers: [
    {
      id: "did:ethr:0x3A655e6EdeBcDf1e7d69195dFf2AeA5fE126bC6E",
      name: "GovTech Singapore",
      revocation: {
        type: "NONE",
      },
      identityProof: {
        type: ":DNS-DID",
        location: "staging.notarise.io",
        key: "did:ethr:0x3A655e6EdeBcDf1e7d69195dFf2AeA5fE126bC6E#controller",
      },
    },
  ],
};
