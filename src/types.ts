import { ComponentType } from "react";
import { v2, WrappedDocument } from "@govtechsg/open-attestation";

export type Attachment = Partial<v2.Attachment>;
type TemplateObject = Partial<v2.TemplateObject>;

export interface Document {
  id?: string;
  $template?: TemplateObject;
  attachments?: Attachment[];
}

export interface Renderer {
  attachment: Attachment;
}

export interface TemplateProps<D extends Document> {
  document: D;
  wrappedDocument?: WrappedDocument<D>;
  handleObfuscation: (field: string) => void;
}

export interface Template<D extends Document> {
  id: string;
  label: string;
  template: ComponentType<TemplateProps<D>>;
}

export interface TemplateRegistry<D extends Document> {
  default: Template<D>[];
  [key: string]: Template<D>[];
}
