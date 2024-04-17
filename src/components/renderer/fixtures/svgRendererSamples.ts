import { v2 } from "@govtechsg/open-attestation";

// TODO: Update types to v4.OpenAttestationDocument
export const v4WithSvgUrlAndDigestMultibase = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    // identityProof: { identityProofType: v4.IdentityProofType.DNSDid, identifier: "example.openattestation.com" },
    identityProof: { identityProofType: v2.IdentityProofType.DNSDid, identifier: "example.openattestation.com" },
  },
  // credentialStatus: { type: "OpenAttestationCredentialStatus", credentialStatusType: v4.CredentialStatusType.None },
  credentialStatus: { type: "OpenAttestationCredentialStatus", credentialStatusType: "NONE" },
  renderMethod: [
    {
      id: "http://mockbucket.com/static/svg_test.svg",
      type: "SvgRenderingTemplate2023",
      name: "SVG Certificate",
      digestMultibase: "z97B2X5Qw9mVzyMhp46dQgWXtX7ipEALvg1coK26eS4f4",
      url: "https://ignorethisurlthisisjusttopasstheschemacheck.com",
      // renderMethodType: v4.RenderMethodType.EmbeddedRenderer,
      renderMethodType: "EMBEDDED_RENDERER",
    },
  ],
  credentialSubject: {
    id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
    type: ["SvgExample"],
    course: { name: "SVG Basics Workshop", fromDate: "01/01/2024", endDate: "16/01/2024" },
    recipient: { name: "TAN CHEN CHEN" },
  },
};

export const v4WithEmbeddedSvgAndDigestMultibase = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    // identityProof: { identityProofType: v4.IdentityProofType.DNSDid, identifier: "example.openattestation.com" },
    identityProof: { identityProofType: v2.IdentityProofType.DNSDid, identifier: "example.openattestation.com" },
  },
  // credentialStatus: { type: "OpenAttestationCredentialStatus", credentialStatusType: v4.CredentialStatusType.None },
  credentialStatus: { type: "OpenAttestationCredentialStatus", credentialStatusType: "NONE" },
  renderMethod: [
    {
      id: `<?xml version="1.0" encoding="UTF-8"?>
<svg width="776" height="496" viewBox="0 0 776 496" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="SVG export trial">
<rect width="100%" height="100%" fill="#e8e8e8" />
<rect id="Sample Certificate-blank for pdf 1" width="776" height="496"/>
<text id="CERTIFICATE OF COMPLETION" fill="#145080" xml:space="preserve" style="white-space: pre" font-family="Nunito" font-size="43" font-weight="bold" letter-spacing="0em"><tspan text-anchor="middle" x="388.0" y="100.647">CERTIFICATE</tspan><tspan text-anchor="middle" x="388.0" y="143.647">OF COMPLETION</tspan></text>
<text id="awarded to" fill="#5DBAB2" xml:space="preserve" style="white-space: pre" font-family="Nunito" font-size="18" font-weight="bold" letter-spacing="0em"><tspan text-anchor="middle" x="388.0" y="182.922">awarded to</tspan></text>
<text id="{{ recipient.name }}" fill="#145080" stroke="#145080" stroke-width="0.7" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="48" letter-spacing="0.02em"><tspan text-anchor="middle" x="388.0" y="237.955">{{recipient.name}}</tspan></text>
<text id="for successfully completing" fill="#5DBAB2" xml:space="preserve" style="white-space: pre" font-family="Nunito" font-size="18" font-weight="800" letter-spacing="0em"><tspan text-anchor="middle" x="388.0" y="280.922">for successfully completing</tspan></text>
<text id="{{course.name}} {{course.fromDate}} - {{ course.endDate }}" fill="#145080" xml:space="preserve" style="white-space: pre" font-family="Nunito" font-size="20" font-weight="bold" letter-spacing="0em"><tspan text-anchor="middle" x="388.0" y="323.58">{{course.name}}</tspan><tspan text-anchor="middle" x="388.0" y="355.58">{{course.fromDate}} - {{course.endDate}}</tspan></text>
</g>
</svg>`,
      type: "SvgRenderingTemplate2023",
      name: "SVG Certificate",
      digestMultibase: "z97B2X5Qw9mVzyMhp46dQgWXtX7ipEALvg1coK26eS4f4",
      url: "https://ignorethisurlthisisjusttopasstheschemacheck.com",
      // renderMethodType: v4.RenderMethodType.EmbeddedRenderer,
      renderMethodType: "EMBEDDED_RENDERER",
    },
  ],
  credentialSubject: {
    id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
    type: ["SvgExample"],
    course: { name: "SVG Basics Workshop", fromDate: "01/01/2024", endDate: "16/01/2024" },
    recipient: { name: "TAN CHEN CHEN" },
  },
};

export const v4WithTamperedEmbeddedSvgAndDigestMultibase = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    // identityProof: { identityProofType: v4.IdentityProofType.DNSDid, identifier: "example.openattestation.com" },
    identityProof: { identityProofType: v2.IdentityProofType.DNSDid, identifier: "example.openattestation.com" },
  },
  // credentialStatus: { type: "OpenAttestationCredentialStatus", credentialStatusType: v4.CredentialStatusType.None },
  credentialStatus: { type: "OpenAttestationCredentialStatus", credentialStatusType: "NONE" },
  renderMethod: [
    {
      id: `<?xml version="1.0" encoding="UTF-8"?>
<svg width="776" height="496" viewBox="0 0 776 496" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="SVG export trial">
<rect width="100%" height="100%" fill="#e8e8e8" />
<rect id="Sample Certificate-blank for pdf 1" width="776" height="496"/>
<text id="TAMPERED CERTIFICATE OF COMPLETION" fill="#145080" xml:space="preserve" style="white-space: pre" font-family="Nunito" font-size="43" font-weight="bold" letter-spacing="0em"><tspan text-anchor="middle" x="388.0" y="100.647">CERTIFICATE</tspan><tspan text-anchor="middle" x="388.0" y="143.647">OF COMPLETION</tspan></text>
<text id="awarded to" fill="#5DBAB2" xml:space="preserve" style="white-space: pre" font-family="Nunito" font-size="18" font-weight="bold" letter-spacing="0em"><tspan text-anchor="middle" x="388.0" y="182.922">awarded to</tspan></text>
<text id="{{ recipient.name }}" fill="#145080" stroke="#145080" stroke-width="0.7" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="48" letter-spacing="0.02em"><tspan text-anchor="middle" x="388.0" y="237.955">{{recipient.name}}</tspan></text>
<text id="for successfully completing" fill="#5DBAB2" xml:space="preserve" style="white-space: pre" font-family="Nunito" font-size="18" font-weight="800" letter-spacing="0em"><tspan text-anchor="middle" x="388.0" y="280.922">for successfully completing</tspan></text>
<text id="{{course.name}} {{course.fromDate}} - {{ course.endDate }}" fill="#145080" xml:space="preserve" style="white-space: pre" font-family="Nunito" font-size="20" font-weight="bold" letter-spacing="0em"><tspan text-anchor="middle" x="388.0" y="323.58">{{course.name}}</tspan><tspan text-anchor="middle" x="388.0" y="355.58">{{course.fromDate}} - {{course.endDate}}</tspan></text>
</g>
</svg>`,
      type: "SvgRenderingTemplate2023",
      name: "SVG Certificate",
      digestMultibase: "z97B2X5Qw9mVzyMhp46dQgWXtX7ipEALvg1coK26eS4f4",
      url: "https://ignorethisurlthisisjusttopasstheschemacheck.com",
      // renderMethodType: v4.RenderMethodType.EmbeddedRenderer,
      renderMethodType: "EMBEDDED_RENDERER",
    },
  ],
  credentialSubject: {
    id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
    type: ["SvgExample"],
    course: { name: "SVG Basics Workshop", fromDate: "01/01/2024", endDate: "16/01/2024" },
    recipient: { name: "TAN CHEN CHEN" },
  },
};

export const v4WithOnlyTamperedEmbeddedSvg = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    // identityProof: { identityProofType: v4.IdentityProofType.DNSDid, identifier: "example.openattestation.com" },
    identityProof: { identityProofType: v2.IdentityProofType.DNSDid, identifier: "example.openattestation.com" },
  },
  // credentialStatus: { type: "OpenAttestationCredentialStatus", credentialStatusType: v4.CredentialStatusType.None },
  credentialStatus: { type: "OpenAttestationCredentialStatus", credentialStatusType: "NONE" },
  renderMethod: [
    {
      id: `<?xml version="1.0" encoding="UTF-8"?>
<svg width="776" height="496" viewBox="0 0 776 496" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="SVG export trial">
<rect width="100%" height="100%" fill="#e8e8e8" />
<rect id="Sample Certificate-blank for pdf 1" width="776" height="496"/>
<text id="TAMPERED CERTIFICATE OF COMPLETION" fill="#145080" xml:space="preserve" style="white-space: pre" font-family="Nunito" font-size="43" font-weight="bold" letter-spacing="0em"><tspan text-anchor="middle" x="388.0" y="100.647">CERTIFICATE</tspan><tspan text-anchor="middle" x="388.0" y="143.647">OF COMPLETION</tspan></text>
<text id="awarded to" fill="#5DBAB2" xml:space="preserve" style="white-space: pre" font-family="Nunito" font-size="18" font-weight="bold" letter-spacing="0em"><tspan text-anchor="middle" x="388.0" y="182.922">awarded to</tspan></text>
<text id="{{ recipient.name }}" fill="#145080" stroke="#145080" stroke-width="0.7" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="48" letter-spacing="0.02em"><tspan text-anchor="middle" x="388.0" y="237.955">{{recipient.name}}</tspan></text>
<text id="for successfully completing" fill="#5DBAB2" xml:space="preserve" style="white-space: pre" font-family="Nunito" font-size="18" font-weight="800" letter-spacing="0em"><tspan text-anchor="middle" x="388.0" y="280.922">for successfully completing</tspan></text>
<text id="{{course.name}} {{course.fromDate}} - {{ course.endDate }}" fill="#145080" xml:space="preserve" style="white-space: pre" font-family="Nunito" font-size="20" font-weight="bold" letter-spacing="0em"><tspan text-anchor="middle" x="388.0" y="323.58">{{course.name}}</tspan><tspan text-anchor="middle" x="388.0" y="355.58">{{course.fromDate}} - {{course.endDate}}</tspan></text>
</g>
</svg>`,
      type: "SvgRenderingTemplate2023",
      name: "SVG Certificate",
      url: "https://ignorethisurlthisisjusttopasstheschemacheck.com",
      // renderMethodType: v4.RenderMethodType.EmbeddedRenderer,
      renderMethodType: "EMBEDDED_RENDERER",
    },
  ],
  credentialSubject: {
    id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
    type: ["SvgExample"],
    course: { name: "SVG Basics Workshop", fromDate: "01/01/2024", endDate: "16/01/2024" },
    recipient: { name: "TAN CHEN CHEN" },
  },
};

export const v2WithSvgUrlAndDigestMultibase = {
  issuers: [
    {
      id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
      name: "Government Technology Agency of Singapore (GovTech)",
      revocation: {
        type: v2.RevocationType.None,
      },
      identityProof: {
        type: v2.IdentityProofType.DNSDid,
        location: "example.openattestation.com",
        key: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller",
      },
    },
  ],
  renderMethod: [
    {
      id: "http://mockbucket.com/static/svg_test.svg",
      type: "SvgRenderingTemplate2023",
      name: "SVG Certificate",
      digestMultibase: "z97B2X5Qw9mVzyMhp46dQgWXtX7ipEALvg1coK26eS4f4",
    },
  ],
  course: {
    name: "SVG Basics Workshop",
    fromDate: "01/01/2024",
    endDate: "16/01/2024",
  },
  recipient: {
    name: "TAN CHEN CHEN",
  },
};

export const v4WithNoRenderMethod = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    // identityProof: { identityProofType: v4.IdentityProofType.DNSDid, identifier: "example.openattestation.com" },
    identityProof: { identityProofType: v2.IdentityProofType.DNSDid, identifier: "example.openattestation.com" },
  },
  // credentialStatus: { type: "OpenAttestationCredentialStatus", credentialStatusType: v4.CredentialStatusType.None },
  credentialStatus: { type: "OpenAttestationCredentialStatus", credentialStatusType: "NONE" },
  credentialSubject: {
    id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
    type: ["SvgExample"],
    course: { name: "SVG Basics Workshop", fromDate: "01/01/2024", endDate: "16/01/2024" },
    recipient: { name: "TAN CHEN CHEN" },
  },
};
