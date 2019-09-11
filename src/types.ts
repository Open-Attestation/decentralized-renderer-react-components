import { ComponentType } from "react";

export interface Attachment {
  type?: string;
  filename?: string;
  data?: string;
}

export interface Document {
  $template?: {
    name?: string;
  };
  attachments?: Attachment[];
  additionalData: any;
  recipient?: {
    name?: string;
    nric?: string;
    course?: string;
  };
  issuedOn?: string;
  name?: string;
  admissionDate?: string;
  graduationDate?: string;
  id?: string;
  transcript?: Array<any>;
}

export interface Renderer {
  /**
   * TODO please to document
   */
  attachment: Attachment;
}

export interface TemplateProps {
  document: Document;
  handleObfuscation: (field: string) => void;
}

export interface Template {
  id: string;
  label: string;
  template: ComponentType<TemplateProps>;
}

export interface TemplateRegistry {
  default: Template[];
  [key: string]: Template[];
}

export type Action = {
  type: string;
  payload?: any;
};
