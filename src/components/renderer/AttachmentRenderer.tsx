import { PdfRenderer } from "./PdfRenderer";
import { UnsupportedRenderer } from "./UnsupportedRenderer";
import React, { FunctionComponent } from "react";
import { Attachment, TemplateProps } from "../../types";

/**
 * Function returning the correct attachment renderer depending on the attachment type
 * @default use UnsupportedRenderer when no suitable renderer is found
 */
export const attachmentRenderer: (attachment: Attachment) => FunctionComponent<TemplateProps> = attachment => {
  if (attachment.type === "application/pdf") {
    // eslint-disable-next-line react/display-name
    return () => <PdfRenderer attachment={attachment} />;
  }
  // eslint-disable-next-line react/display-name
  return () => <UnsupportedRenderer attachment={attachment} />;
};
