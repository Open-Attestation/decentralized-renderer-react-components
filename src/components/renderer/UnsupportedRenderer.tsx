import React, { FunctionComponent } from "react";
import { Renderer } from "../../types";
import { getAttachmentMimeType } from "../../utils";

/**
 * Component rendering unsupported attachments
 */
export const UnsupportedRenderer: FunctionComponent<Renderer> = ({ attachment }) => (
  <div>
    <h2>Rendering of this type of attachment is not supported.</h2>
    <p>Please check your mime-type: {getAttachmentMimeType(attachment)}</p>
  </div>
);
