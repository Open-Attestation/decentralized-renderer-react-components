import React, { FunctionComponent } from "react";
import { TemplateProps } from "../../../../src";
import { DriverLicense } from "../../../application/fixtures/v3/driverLicense";

export const Template: FunctionComponent<TemplateProps<DriverLicense>> = ({ document }) => {
  return (
    <div className="container">
      <h1>Driver License</h1>
      <small>SN: {document.credentialSubject.id}</small>
      {document.credentialSubject.class.map((c, i) => (
        <div key={i} style={{ marginTop: 10 }}>
          <div>Class: {c.type}</div>
          <div>Effective Date: {c.effectiveDate ? new Date(c.effectiveDate).toDateString() : ""}</div>
        </div>
      ))}
    </div>
  );
};
