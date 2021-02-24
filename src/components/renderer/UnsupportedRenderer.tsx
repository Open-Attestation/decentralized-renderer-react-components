import React, { FunctionComponent } from "react";
import { Renderer } from "../../types";
import { isV2Attachment } from "../../utils";

/**
 * Component rendering unsupported attachments
 */
export const UnsupportedRenderer: FunctionComponent<Renderer> = ({ attachment }) => (
  <div>
    <h2>Rendering of this type of attachment is not supported.</h2>
    <p>Please check your mime-type: {isV2Attachment(attachment) ? attachment.type : attachment.mimeType}</p>
  </div>
);
