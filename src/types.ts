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

export interface Template {
  id: string;
  label: string;
}
export interface TemplateWithComponent<D extends Document> extends Template {
  template: ComponentType<TemplateProps<D>>;
}

export interface TemplateRegistry<D extends Document> {
  [key: string]: TemplateWithComponent<D>[];
}

export interface TemplateWithTypes<D extends Document> extends TemplateWithComponent<D> {
  type: string;
}
