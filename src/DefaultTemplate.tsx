import React from "react";
import { TemplateProps, TemplateWithComponent } from "./types";

export const DefaultTemplate: React.FunctionComponent<TemplateProps<any>> = props => {
  return (
    <div id="default-template">
      <h3
        style={{
          textAlign: "center"
        }}
      >
        This is the OpenAttestation default renderer
      </h3>
      <div
        role="alert"
        style={{
          textAlign: "center",
          marginTop: "1rem",
          marginBottom: "1rem",
          color: "#856404",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeeba",
          padding: ".75rem 1.25rem"
        }}
      >
        You see this template because the certificate issuer misconfigured the template configuration of your document.
        Please check with the certificate issuer. More information is available in{" "}
        <a href="https://openattestation.com/docs/advanced/custom-renderer" target="_blank" rel="noopener noreferrer">
          the documentation
        </a>
        .
      </div>
      <pre style={{ backgroundColor: "lightgray" }}>{JSON.stringify(props.document, null, 2)}</pre>
    </div>
  );
};

export const defaultTemplate: TemplateWithComponent<any> = {
  id: "default-template",
  label: "Default",
  template: DefaultTemplate
};
