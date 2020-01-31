import { Attachment, Document, Template, TemplateRegistry } from "./types";
import React from "react";

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
  attachmentToComponent: (attachment: Attachment) => React.FunctionComponent
): Template<D>[] {
  if (!document) return [];
  // Find the template in the template registry or use a default template
  const templateName = document && document.$template && document.$template.name;
  const selectedTemplate = (templateName && templateRegistry[templateName]) || templateRegistry.default;

  // Create additional tabs from attachments
  const templatesFromAttachments = (document.attachments || []).map((attachment, index) => ({
    id: `attachment-${index}`,
    label: attachment.filename || "Unknown filename",
    template: attachmentToComponent(attachment)
  }));
  return [...selectedTemplate, ...templatesFromAttachments];
}
