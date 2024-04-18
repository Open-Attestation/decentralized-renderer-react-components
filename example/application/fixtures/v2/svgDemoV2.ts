import { v2 } from "@govtechsg/open-attestation";

export const svgEmbeddedDemoV2 = {
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
      id: `<svg width="340" height="110" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="330" height="100" fill="#d4d4d4" stroke="orange" stroke-width="8" rx="10" ry="10" />
    <text x="170" y="45" font-family="Arial" font-size="15" fill="black" text-anchor="middle">Congratulations for achieving {{qualification}}!</text>
    <text x="170" y="70" font-family="Arial" font-size="12" fill="black" text-anchor="middle">Awarded to: {{recipient.name}}</text>
    </svg>`,
      type: "SvgRenderingTemplate2023",
      name: "SVG Demo",
    },
  ],
  qualification: "SVG rendering",
  recipient: {
    name: "Yourself",
  },
};

export const svgHostedDemoV2 = {
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
      id:
        "https://raw.githubusercontent.com/Open-Attestation/decentralized-renderer-react-components/master/example/application/fixtures/images/demo-cert.svg",
      type: "SvgRenderingTemplate2023",
      name: "SVG Demo",
    },
  ],
  qualification: "SVG rendering",
  recipient: {
    name: "Yourself",
  },
};
