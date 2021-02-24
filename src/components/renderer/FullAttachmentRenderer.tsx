import { PdfRenderer } from "./PdfRenderer";
import { UnsupportedRenderer } from "./UnsupportedRenderer";
import React from "react";
import { Attachment } from "../../types";
import { getAttachmentMimeType } from "../../utils";

/**
 * Function returning the correct attachment renderer depending on the attachment type. Currently supports:
 * - application/pdf
 * @default use UnsupportedRenderer when no suitable renderer is found
 */
export function fullAttachmentRenderer(attachment: Attachment): React.FunctionComponent {
  if (getAttachmentMimeType(attachment) === "application/pdf") {
    // eslint-disable-next-line react/display-name
    return () => <PdfRenderer attachment={attachment} />;
  }
  // eslint-disable-next-line react/display-name
  return () => <UnsupportedRenderer attachment={attachment} />;
}
