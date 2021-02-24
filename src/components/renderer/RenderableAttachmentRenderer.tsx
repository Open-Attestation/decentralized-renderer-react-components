import { PdfRenderer } from "./PdfRenderer";
import React from "react";
import { Attachment } from "../../types";
import { isV2Attachment } from "../../utils";

/**
 * Function returning the correct attachment renderer depending on the attachment type. Currently supports:
 * - application/pdf
 * returns null when not attachment cannot be rendered
 */
export function renderableAttachmentRenderer(attachment: Attachment): React.FunctionComponent | null {
  if (isV2Attachment(attachment) ? attachment.type === "application/pdf" : attachment.mimeType === "application/pdf") {
    // eslint-disable-next-line react/display-name
    return () => <PdfRenderer attachment={attachment} />;
  }
  return null;
}
