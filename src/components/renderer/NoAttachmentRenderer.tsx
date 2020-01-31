import { UnsupportedRenderer } from "./UnsupportedRenderer";
import React from "react";
import { Attachment } from "../../types";

/**
 * Function using unsupported renderer for all kind of attachments
 */
export function noAttachmentRenderer<D extends Document>(attachment: Attachment): React.FunctionComponent {
  // eslint-disable-next-line react/display-name
  return () => <UnsupportedRenderer attachment={attachment} />;
}
