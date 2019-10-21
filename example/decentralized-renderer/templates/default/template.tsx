import React, { FunctionComponent } from "react";
import { NestedComponent } from "./NestedComponent";
import { TemplateProps } from "../../../../src";
import { OpencertsDocuments } from "../../../types";

export const Template: FunctionComponent<TemplateProps<OpencertsDocuments>> = ({ document }) => (
  <div className="container">
    <NestedComponent>{document}</NestedComponent>
  </div>
);
