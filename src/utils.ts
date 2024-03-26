import { FunctionComponent } from "react";
import { Attachment, TemplateRegistry, TemplateWithComponent, TemplateWithTypes } from "./types";
import { wrongTemplate, noTemplate } from "./DefaultTemplate";
import { OpenAttestationDocument, v2, v3 } from "@govtechsg/open-attestation";

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

export const isV2Document = (document: any): document is v2.OpenAttestationDocument => {
  return !!document.$template;
};

export const isV3Document = (document: any): document is v3.OpenAttestationDocument => {
  return !!document["@context"] && !!document.openAttestationMetadata;
};

export const isV4Document = (document: any): boolean => {
  return !!document["@context"] && !document.openAttestationMetadata;
};

const getTemplateName = (document: OpenAttestationDocument): string => {
  if (isV2Document(document) && typeof document.$template === "object") {
    return document.$template.name;
  }
  if (isV3Document(document) && document.openAttestationMetadata.template) {
    return document.openAttestationMetadata.template.name;
  }
  return "";
};

export const isV2Attachment = (attachment: any): attachment is v2.Attachment => {
  return !!attachment.type;
};

export const getAttachmentMimeType = (attachment: Attachment): string => {
  return isV2Attachment(attachment) ? attachment.type : attachment.mimeType;
};

const truePredicate = (): boolean => true;

// TODO this function is weird, returns current template + templates for attachments
export function documentTemplates(
  document: OpenAttestationDocument,
  templateRegistry: TemplateRegistry,
  attachmentToComponent: (attachment: Attachment, document: OpenAttestationDocument) => FunctionComponent | null
): TemplateWithTypes[] {
  if (!document) return [];
  const docAsV2orV3 = isV2Document(document)
    ? (document as v2.OpenAttestationDocument)
    : (document as v3.OpenAttestationDocument);
  // Find the template in the template registry or use a default template
  const templateName = getTemplateName(docAsV2orV3);

  const selectedTemplate: TemplateWithComponent[] =
    templateName === "" ? [noTemplate] : (templateName && templateRegistry[templateName]) || [wrongTemplate];

  // Add type property to differentiate between custom template tabs VS attachments tab
  const tabsRenderedFromCustomTemplates: TemplateWithTypes[] = selectedTemplate
    .map((template) => {
      return { ...template, type: "custom-template" };
    })
    .filter((template) => (template.predicate ? template.predicate({ document }) : truePredicate()));

  const tabsRenderedFromAttachments = (docAsV2orV3.attachments || ([] as Attachment[]))
    .map((attachment, index) =>
      isV2Attachment(attachment)
        ? {
            id: `attachment-${index}`,
            label: attachment.filename || "Unknown filename",
            type: attachment.type || "Unknown filetype",
            template: attachmentToComponent(attachment, document)!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
          }
        : {
            id: `attachment-${index}`,
            label: attachment.fileName || "Unknown filename",
            type: attachment.mimeType || "Unknown filetype",
            template: attachmentToComponent(attachment, document)!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
          }
    )
    .filter((template) => template.template);

  return [...tabsRenderedFromCustomTemplates, ...tabsRenderedFromAttachments];
}
