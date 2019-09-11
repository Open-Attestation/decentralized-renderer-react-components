import React, { FunctionComponent } from "react";
import { Renderer } from "../../types";

/**
 * Component rendering unsupported attachments
 */
export const UnsupportedRenderer: FunctionComponent<Renderer> = ({ attachment }) => (
  <div>
    <h2>Rendering of this type of attachment is not supported.</h2>
    <p>Please check your mime-type: {attachment.type}</p>
  </div>
);
