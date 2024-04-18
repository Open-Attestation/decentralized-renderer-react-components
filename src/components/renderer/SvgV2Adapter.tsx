import React, { CSSProperties } from "react";
import { DisplayResult, SvgRenderer, v4OpenAttestationDocument } from "./SvgRenderer";
import { v2 } from "@govtechsg/open-attestation";

const mapV2toV4 = (document: v2.OpenAttestationDocument): v4OpenAttestationDocument => {
  const clonedDocument = { ...document };
  const propsToOmit = ["$template", "id", "issuers", "network", "renderMethod"];
  propsToOmit.forEach((v2Property) => delete (clonedDocument as any)[v2Property]);
  return {
    issuer: {
      id: document.issuers[0].id || "default id",
      identityProof: {
        identifier: document.issuers[0].identityProof!.location!,
        identityProofType: document.issuers[0].identityProof!.type,
      },
      name: document.issuers[0].name,
      type: "OpenAttestationIssuer",
    },
    renderMethod: (document as any)["renderMethod"],
    credentialSubject: clonedDocument,
  };
};

export interface __unsafe__not__for__production__v2__SvgRendererProps {
  /** The OpenAttestation v4 document to display */
  document: v2.OpenAttestationDocument; // TODO: Update to OpenAttestationDocument
  /** Override the img style */
  style?: CSSProperties;
  /** Override the img className */
  className?: string;
  // TODO: How to handle if svg fails at img? Currently it will return twice
  /** An optional callback method that returns the display result  */
  onResult?: (result: DisplayResult) => void;
}

const __unsafe__not__for__production__v2__SvgRenderer = React.forwardRef<
  HTMLIFrameElement,
  __unsafe__not__for__production__v2__SvgRendererProps
>(({ document, style, className, onResult }, ref) => {
  const remappedDocument = mapV2toV4(document);
  return <SvgRenderer document={remappedDocument} style={style} className={className} onResult={onResult} ref={ref} />;
});

__unsafe__not__for__production__v2__SvgRenderer.displayName = "SvgRendererComponentv2";

export { __unsafe__not__for__production__v2__SvgRenderer };
