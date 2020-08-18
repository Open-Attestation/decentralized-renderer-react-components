import { ComponentType } from "react";
import { v2, WrappedDocument, OpenAttestationDocument } from "@govtechsg/open-attestation";

export type Attachment = v2.Attachment;
export interface Renderer {
  attachment: Attachment;
}

export interface TemplateProps<D extends OpenAttestationDocument = OpenAttestationDocument> {
  document: D;
  wrappedDocument?: WrappedDocument<D>;
  handleObfuscation: (field: string) => void;
}

export interface Template {
  id: string;
  label: string;
}
export interface TemplateWithComponent<D extends OpenAttestationDocument = OpenAttestationDocument> extends Template {
  template: ComponentType<TemplateProps<D>>;
}

export interface TemplateRegistry<D extends OpenAttestationDocument = OpenAttestationDocument> {
  [key: string]: TemplateWithComponent<D>[];
}

export interface TemplateWithTypes extends TemplateWithComponent {
  type: string;
}
export { v2, OpenAttestationDocument } from "@govtechsg/open-attestation";
