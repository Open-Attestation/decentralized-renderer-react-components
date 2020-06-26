import { Attachment, Document, Template, TemplateRegistry } from "./types";
import React from "react";
import { defaultTemplate } from "./DefaultTemplate";

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

// TODO this function is weird, returns current template + templates for attachments
export function documentTemplates<D extends Document>(
  document: Document,
  templateRegistry: TemplateRegistry<D>,
  attachmentToComponent: (attachment: Attachment, document: Document) => React.FunctionComponent
): Template<D>[] {
  if (!document) return [];
  // Find the template in the template registry or use a default template
  const templateName = document && document.$template && document.$template.name;
  const selectedTemplate = (templateName && templateRegistry[templateName]) || [defaultTemplate];

  // Only render tabs for attachment with pdf type
  const templatesFromPdfAttachmentOnly = (document.attachments || []).filter(attachment => {
    return attachment.type === "application/pdf";
  });

  // Create additional tabs from attachments
  const templatesFromAttachments = templatesFromPdfAttachmentOnly.map((attachment, index) => ({
    id: `attachment-${index}`,
    label: attachment.filename || "Unknown filename",
    template: attachmentToComponent(attachment, document)
  }));

  return [...selectedTemplate, ...templatesFromAttachments];
}
