import React, { FunctionComponent } from "react";
import { NestedComponent } from "./NestedComponent";
import { TemplateProps } from "../../../../src/types";

export const Template: FunctionComponent<TemplateProps> = ({ document }) => (
  <div className="container">
    <NestedComponent>{document}</NestedComponent>
  </div>
);
