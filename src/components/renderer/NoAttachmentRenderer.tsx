import React from "react";

/**
 * Function using unsupported renderer for all kind of attachments
 */
export function noAttachmentRenderer<D extends Document>(): React.FunctionComponent {
  // eslint-disable-next-line react/display-name
  return () => null;
}
