import React from "react";
import { SvgRenderer, SvgRendererProps, v4OpenAttestationDocument } from "./SvgRenderer";
import { v2 } from "@govtechsg/open-attestation";

const mapV2toV4 = (document: v2.OpenAttestationDocument): v4OpenAttestationDocument => {
  const clonedDocument = { ...document };
  const propsToOmit = ["$template", "id", "issuers", "network", "renderMethod"];
  propsToOmit.forEach((v2Property) => delete (clonedDocument as any)[v2Property]);

  return {
    issuer: {
      id: document.issuers[0].id || "issuers[0].id not found",
      identityProof: {
        identifier: document.issuers[0].identityProof?.location || "issuers[0].identityProof.location not found",
        identityProofType: document.issuers[0].identityProof?.type || v2.IdentityProofType.DNSDid,
      },
      name: document.issuers[0].name,
      type: "OpenAttestationIssuer",
    },
    renderMethod: (document as any)["renderMethod"],
    credentialSubject: clonedDocument,
  };
};

export type __unsafe__not__for__production__v2__SvgRendererProps = Omit<SvgRendererProps, "document"> & {
  /** The OpenAttestation v2 document to display */
  document: v2.OpenAttestationDocument;
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
