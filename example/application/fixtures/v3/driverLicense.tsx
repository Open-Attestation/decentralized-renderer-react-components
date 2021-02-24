import { v3 } from "@govtechsg/open-attestation";

export const driverLicense = {
  version: "https://schema.openattestation.com/3.0/schema.json",
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json",
    "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
    "https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json"
  ],
  reference: "SERIAL_NUMBER_123",
  name: "Republic of Singapore Driving Licence",
  issuanceDate: "2010-01-01T19:23:24Z",
  validFrom: "2010-01-01T19:23:24Z",
  issuer: {
    id: "https://example.com",
    name: "DEMO STORE"
  },
  type: ["VerifiableCredential", "DrivingLicenceCredential"],
  credentialSubject: {
    id: "did:example:SERIAL_NUMBER_123",
    class: [
      {
        type: "3",
        effectiveDate: "2010-01-01T19:23:24Z"
      },
      {
        type: "3A",
        effectiveDate: "2010-01-01T19:23:24Z"
      }
    ]
  },
  openAttestationMetadata: {
    template: {
      name: "DRIVER_LICENSE",
      type: "EMBEDDED_RENDERER",
      url: "https://localhost:3000/renderer"
    },
    proof: {
      type: "OpenAttestationProofMethod",
      method: "DID",
      value: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
      revocation: {
        type: "NONE"
      }
    },
    identityProof: {
      type: "DNS-DID",
      identifier: "tradetrust.io"
    }
  },
  attachments: [
    {
      fileName: "sample.pdf",
      mimeType: "application/pdf",
      data: "BASE64_ENCODED_FILE"
    }
  ],
  proof: {
    type: "OpenAttestationMerkleProofSignature2018",
    proofPurpose: "assertionMethod",
    targetHash: "28712f6b5a160dcaf311c36c1109803ed54f7eb29d8329f44aa0266c1ec284fe",
    proofs: [],
    merkleRoot: "28712f6b5a160dcaf311c36c1109803ed54f7eb29d8329f44aa0266c1ec284fe",
    salts:
      "W3sidmFsdWUiOiIzZGJiZjQ0YTdlNTlmMmQzNTMyZDMxYzYzOTVkY2U0OTEzZTZjY2EwZDgxMWMyZWQ4NWEzZjc0NjA1NTRlNjk4IiwicGF0aCI6InZlcnNpb24ifSx7InZhbHVlIjoiZTE5YjIxMjI5OWMyNTQwMWJhMWQ1ZTE0NjE1MTJlMjcxYzYyZmI5MmVlMDllM2JmMzg3NjE1YWE1MGEwMjYxMyIsInBhdGgiOiJAY29udGV4dFswXSJ9LHsidmFsdWUiOiIxODM3MmVmZmRlODhmN2Y1YmY5NWVmY2YzMTZkMTU5M2YzMDE2NjY0MmE4YzE1NjllYWEwZDhmZmQzZmUyMjA2IiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjJkNzNiYjBmMDQ3MTdjOWNiYTg3M2M0NTUxZDZiODRhMWFmZDgxNDAzMWVjZWRmNTUxMjcwZTA0MDMyMjg4MTUiLCJwYXRoIjoiQGNvbnRleHRbMl0ifSx7InZhbHVlIjoiYzBlNTE0ZjBjMWI1MDdiMThhMTA4NTllNDQ0ZTAwZDBmNmM1ZjUyMjZmMDgxZmMwMThlNTIxZjIzNDllYmI2ZiIsInBhdGgiOiJAY29udGV4dFszXSJ9LHsidmFsdWUiOiIzNzQxNWVlM2Y3M2E0MDczOTJiY2EzMTUwMjZmZjYyNzA4ODU1ODc0NTYwM2UzZDBhYmI2Y2Y5ZDk1NmYyMzA2IiwicGF0aCI6InJlZmVyZW5jZSJ9LHsidmFsdWUiOiI4NGIxMjQwMWFkYTFjNmQwMzZlNGIzMzhjMmY5YzdiMzYzYzgxZDk2NGY1MWM1OWEzZTMzNDFlMTY1ODI1N2NmIiwicGF0aCI6Im5hbWUifSx7InZhbHVlIjoiNjdmYTI1ODJjYTE4YzQ3MGEyMjk3MzI1ZmExYmE1MTFmMmMwMGM4ZDk1NWEyMDg3ZjYxMjY1NWQ5NjUzNjExMSIsInBhdGgiOiJpc3N1YW5jZURhdGUifSx7InZhbHVlIjoiMmVmOTRmY2YwNzZhZDgxODk3OTRlYzJkNWRlZTA5NmU1MzkyNWFkODJlMjdhNzY3MzBhYjFhNmE1YzQyOTQ1NSIsInBhdGgiOiJ2YWxpZEZyb20ifSx7InZhbHVlIjoiYTQyZDczNjkwZGVkNTJkN2U4ZDM1OWMxNDNmMjYwNDY2NGVjOWU2NDAyMjcwOGViN2EyZmU4ZDI1YzEzOGU1OCIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiYmZhNDBkYzdkNzliYjRhZjllOWQ3OTEzY2JmMDZiMzFhYmI0M2EyOThkYTRhNDg1ODlhM2Q3YzlhYTcwZWI1NSIsInBhdGgiOiJpc3N1ZXIubmFtZSJ9LHsidmFsdWUiOiI3MTU5NmNmNDJmM2I1N2YyNTRmYjU1NDM1ZGEwNTFlZTUzNzVjMzQxZjI5NWY5YWRmZGU2ZmI4ZGI4YTM3NDRiIiwicGF0aCI6InR5cGVbMF0ifSx7InZhbHVlIjoiMGExMzhkMzQ3MTIxN2Y5MzE1YmNmZTYyYThlNjRhZjQ1NTIxMTc3OWEwODRkYTFlNDY4OWYzZWIxM2IwZDgzZiIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6IjY0MWFjOTNhYzRlN2M4ZDY3NmVlMjQ2YmQ2NjEzNWRlY2U4NTdkNjk4ZWQzNzMxMTc2YWVhNGNiOTdhNzEzNGIiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiNDc4OTU1YjQ4MGUxODQ0NjIwMTA2NWEwY2E1NTk1YjAwNzgyMWMwMGNjZTRiYzNmMjljMTQ4NWUxMzU4MDI2NCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5jbGFzc1swXS50eXBlIn0seyJ2YWx1ZSI6ImQyN2E0ZWFjNjZjNGUxNjBhZmU1ZTkxNmNjZjc3ZTZkODY4NzFkMDJhZGI3OTBmOTlhOTA1MjU3ZWYxYzJlNWYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiIzN2MxODgzZGE3Mjk2OWM5MmRmYTNhOTRlMDNlNzUxYmRkMjRlYjllZmEwZjU1MjllNjA4ZTU2N2Y2ODAwMmMzIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmNsYXNzWzFdLnR5cGUifSx7InZhbHVlIjoiMTU0NzYyYzJjZDRmYmNlMzdjMjc1YTA4OWFiMzhiZmE2NzEyZTMwMmY1ZWQ5MzU0NDEwNmMwNmZjZDA3N2M4NCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5jbGFzc1sxXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjM5YzhjMDk5NGZkYzc5ZDRlZTdiYjM2ZWZjYjQ1NzYzM2NiNjdjMTA1ODE2NzNmMjViNzI0ODlmZjYzMzc0OWYiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEudGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiIyZDRlMDE2YTZmZTJiMjlmMWUxMWJhYmU4YmIwZjA1N2M1ODYwZGZjMGVlZjBhNjQ5MGI3MzY2ZTQzODNjNDlmIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnRlbXBsYXRlLnR5cGUifSx7InZhbHVlIjoiMTMxZWNkOGY0ZGU2YTJjNTc2ODIwYmNjZTE4MzA5ZjA4OTk3OTE1M2I3OGZiMzc5YWQ0OWYxODI1YzYwZDcyOCIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS50ZW1wbGF0ZS51cmwifSx7InZhbHVlIjoiMjNmZDdiYTkwYWU2NjgwNjU3ZGZjNjJmM2EwZmQxNGMyMTFjMmNhMjk2MzAwM2M3NjNjMzI4YjM2MzQxNTFkYyIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi50eXBlIn0seyJ2YWx1ZSI6IjZmYzIyN2U0Yjk5MzJlZGIzZTY3MThmODRjNWZmOWJlNDFhMzQzODk0YzUxY2E1N2U5ZTUxMjg2NGFhMDU5MGMiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6IjJhZjNhOThjZTQ2ZmVlMmZiMGMyNzk0OWJhZTg0Mzg4YTNlZDA0ZDI1ZmI4MmM1ZjdjZjMyYjI3YWRmZjU0ZDYiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YudmFsdWUifSx7InZhbHVlIjoiZjg5NmJjZDZjMDk5YzJkNzBjM2YzOWJlODkzZjBiMzJiMjhlZTViNjI3M2M5ZDc3ZTljMTQzMDIyMTE1YWY3MyIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi5yZXZvY2F0aW9uLnR5cGUifSx7InZhbHVlIjoiNTA4ODZkOTRjNDU1N2ViM2ZjYzY2ZDJjOWEzYWZkMDZmZDI2ZTI0ZDg3Y2Y2MjZhZTRhZDZkZDlkYjEyMmExZiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiYTYyNTk0NDg4NDkzNTA4MzBkMjA3ZjVlOTg5MzNlNGFlMGJkODQxMWExNGMwZmFiMThmMmJjOWVlZWM4MTU0ZSIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLmlkZW50aWZpZXIifSx7InZhbHVlIjoiNGYzN2IyYTA5NmI3YzRlODhjZjExNDBjYzlhZDZiODNkOTI0Njk0ZjYzODM1Yzc3OTU4ZmMwYWQ2ZTVkOTgxZSIsInBhdGgiOiJhdHRhY2htZW50c1swXS5maWxlTmFtZSJ9LHsidmFsdWUiOiI3Y2FkYzJmZDgyZTkxYTQ5Yzc1NDdjNjNhZjBjYzkyZjkwYjI2NDliNjNkNzIwNTIwMjQyNjZlMzQzMTk0MDIxIiwicGF0aCI6ImF0dGFjaG1lbnRzWzBdLm1pbWVUeXBlIn0seyJ2YWx1ZSI6Ijg5Y2MwN2Q1MTJhZWI3YzI1NDU5ZTY3OWEyMWIxOTYwMmY2OWJlNDA1ZTgyODg2YTAzZGExZGIwMWQ4NmI2NTQiLCJwYXRoIjoiYXR0YWNobWVudHNbMF0uZGF0YSJ9XQ==",
    privacy: {
      obfuscated: []
    }
  }
} as v3.WrappedDocument;
