import React, { FunctionComponent } from "react";
import { TemplateProps } from "../../../../src/types";
export const Template: FunctionComponent<TemplateProps> = ({ document }) => (
  <div className="container">
    <h1>Rendered with custom template</h1>
    <p>Adding change to custom template</p>
    <pre>{JSON.stringify(document, null, 2)}</pre>
  </div>
);
