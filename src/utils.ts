import { Attachment, TemplateRegistry, TemplateWithComponent, TemplateWithTypes } from "./types";
import React from "react";
import { defaultTemplate } from "./DefaultTemplate";
import { OpenAttestationDocument, v2 } from "@govtechsg/open-attestation";

export const repeat = (times: number) => (callback: (index: number) => any) =>
  Array(times)
    .fill(0)
    .map((_, index) => callback(index));

export const noop = (): void => void 0;

// Currently using https://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
export const inIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

const isV2Document = (document: any): document is v2.OpenAttestationDocument => {
  return !!document.$template;
};

const truePredicate = (): boolean => true;

// TODO this function is weird, returns current template + templates for attachments
export function documentTemplates(
  document: OpenAttestationDocument,
  templateRegistry: TemplateRegistry,
  attachmentToComponent: (attachment: Attachment, document: OpenAttestationDocument) => React.FunctionComponent
): TemplateWithTypes[] {
  if (!document || !isV2Document(document)) return [];
  // Find the template in the template registry or use a default template
  const templateName = typeof document.$template === "object" ? document.$template.name : "";
  const selectedTemplate: TemplateWithComponent[] = (templateName && templateRegistry[templateName]) || [
    defaultTemplate
  ];

  // Add type property to differentiate between custom template tabs VS attachments tab
  const templatesFromCustom: TemplateWithTypes[] = selectedTemplate
    .map(template => {
      return { ...template, type: "custom-template" };
    })
    .filter(template => (template.predicate ? template.predicate({ document }) : truePredicate()));

  // Create additional tabs from attachments
  const templatesFromAttachments = (document.attachments || []).map((attachment: Attachment, index: number) => ({
    id: `attachment-${index}`,
    label: attachment.filename || "Unknown filename",
    type: attachment.type || "Unknown filetype",
    template: attachmentToComponent(attachment, document)
  }));

  return [...templatesFromCustom, ...templatesFromAttachments];
}
