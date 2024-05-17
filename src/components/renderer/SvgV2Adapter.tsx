import React from "react";
import { SvgRenderer, SvgRendererProps } from "./SvgRenderer";
import type { v2, v4 } from "@govtechsg/open-attestation";

type V2OpenAttestationDocumentWithSvgBase = v2.OpenAttestationDocument &
  Pick<SvgRendererProps["document"], "renderMethod">;
export type V2OpenAttestationDocumentWithSvg = V2OpenAttestationDocumentWithSvgBase & { [k: string]: unknown };
type V2OpenAttestationDocumentWithSvgNoAttachments = Omit<V2OpenAttestationDocumentWithSvg, "attachments">;

const mapV2toV4 = (document: V2OpenAttestationDocumentWithSvg): v4.OpenAttestationDocument => {
  const clonedDocument = { ...document };
  const propsToOmit: (keyof V2OpenAttestationDocumentWithSvgBase)[] = [
    "$template",
    "id",
    "issuers",
    "network",
    "renderMethod",
    "attachments",
  ];
  propsToOmit.forEach((v2Property) => delete clonedDocument[v2Property]);

  return {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
    ],
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuer: {
      id: document.issuers[0].id || "issuers[0].id not found",
      identityProof: {
        identifier: document.issuers[0].identityProof?.location || "issuers[0].identityProof.location not found",
        identityProofType:
          document.issuers[0].identityProof?.type ||
          ("DNS-DID" as v4.OpenAttestationDocument["issuer"]["identityProof"]["identityProofType"]),
      },
      name: document.issuers[0].name,
      type: "OpenAttestationIssuer",
    },
    renderMethod: document.renderMethod,
    credentialSubject: clonedDocument as V2OpenAttestationDocumentWithSvgNoAttachments, // Need to cast due to mismatch in "attachments" typing
  };
};

export type __unsafe__not__for__production__v2__SvgRendererProps = Omit<SvgRendererProps, "document"> & {
  /** The OpenAttestation v2 document to display */
  document: V2OpenAttestationDocumentWithSvg;
};

const __unsafe__not__for__production__v2__SvgRenderer = React.forwardRef<
  HTMLImageElement,
  __unsafe__not__for__production__v2__SvgRendererProps
>(({ document, ...rest }, ref) => {
  const remappedDocument = mapV2toV4(document);
  return <SvgRenderer {...rest} document={remappedDocument} ref={ref} />;
});

__unsafe__not__for__production__v2__SvgRenderer.displayName = "SvgRendererAdapterComponent";

export { __unsafe__not__for__production__v2__SvgRenderer };
