import { PdfRenderer } from "./PdfRenderer";
import { UnsupportedRenderer } from "./UnsupportedRenderer";
import React from "react";
import { Attachment, Document } from "../../types";

/**
 * Function returning the correct attachment renderer depending on the attachment type. Currently supports:
 * - application/pdf
 * @default use UnsupportedRenderer when no suitable renderer is found
 */
export function fullAttachmentRenderer<D extends Document>(attachment: Attachment): React.FunctionComponent {
  if (attachment.type === "application/pdf") {
    // eslint-disable-next-line react/display-name
    return () => <PdfRenderer attachment={attachment} />;
  }
  // eslint-disable-next-line react/display-name
  return () => <UnsupportedRenderer attachment={attachment} />;
}
