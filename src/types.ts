import { ComponentType } from "react";

export interface Attachment {
  type?: string;
  filename?: string;
  data?: string;
}

export interface Document {
  id?: string;
  $template?: { name?: string; url?: string; type?: string };
  attachments?: Attachment[];
}

export interface SignedDocument<D extends Document> {
  data: D;
  signature: {
    merkleRoot: string;
    targetHash: string;
    type: string;
  };
}
export interface Renderer {
  /**
   * TODO please to document
   */
  attachment: Attachment;
}

export interface TemplateProps<D extends Document> {
  document: D;
  rawDocument?: SignedDocument<D>;
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

export type Action = {
  type: string;
  payload?: any;
};
