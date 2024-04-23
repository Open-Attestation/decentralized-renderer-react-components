import { ComponentType } from "react";
import type { v2, WrappedDocument, OpenAttestationDocument, v3 } from "@govtechsg/open-attestation";
import { v4OpenAttestationDocument } from "./components/renderer/SvgRenderer";

export type Attachment = v2.Attachment | v3.Attachment;
export interface Renderer {
  attachment: Attachment;
}

export interface TemplateProps<D extends OpenAttestationDocument = OpenAttestationDocument> {
  document: D | v4OpenAttestationDocument; // TODO: Remove after OpenAttestation library has been updated with v4 types
  wrappedDocument?: WrappedDocument<D>;
  handleObfuscation: (field: string) => void;
}

export interface Template {
  id: string;
  label: string;
}
export interface TemplateWithComponent<D extends OpenAttestationDocument = OpenAttestationDocument> extends Template {
  template: ComponentType<TemplateProps<D>>;
  predicate?: ({ document }: { document: D }) => boolean;
}

export interface TemplateRegistry<D extends OpenAttestationDocument = OpenAttestationDocument> {
  [key: string]: TemplateWithComponent<D>[];
}

export interface TemplateWithTypes extends TemplateWithComponent {
  type: string;
}
