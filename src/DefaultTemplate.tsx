import React from "react";
import { TemplateProps, TemplateWithComponent } from "./types";

const container = {
  maxWidth: "1024px",
  marginRight: "auto",
  marginLeft: "auto",
  paddingRight: "1rem",
  paddingLeft: "1rem",
};

const textColor = `#333`;
const paddingBox = `.75rem 1.25rem`;

export const DefaultTemplate: React.FunctionComponent<TemplateProps> = (props) => {
  return (
    <div id="default-template">
      <div style={{ ...container, ...{ color: textColor } }}>
        <h1
          style={{
            fontSize: "26px",
          }}
        >
          This is the OpenAttestation default renderer
        </h1>
        <div
          role="alert"
          style={{
            marginTop: "1.5rem",
            marginBottom: "1.5rem",
            backgroundColor: "#fffbec",
            padding: paddingBox,
          }}
        >
          <div style={{ display: "flex", flexWrap: "nowrap", flexDirection: "row", alignItems: "center" }}>
            <div style={{ flex: "0 0 50px", marginRight: "24px" }}>
              <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                <g clipPath="url(#a)">
                  <path
                    d="m47.7 19.6.3 2.1c.7 5-.3 10.1-2.8 14.4-2.5 4.4-6.3 7.9-10.9 9.9-4.6 2.1-9.7 2.6-14.6 1.5s-9.3-3.8-12.6-7.6c-3.3-3.8-5.2-8.6-5.6-13.6-.3-5 1-10 3.7-14.2C8 7.9 12 4.7 16.7 3c4.7-1.7 9.9-1.9 14.7-.5M25.3 10.9v21"
                    stroke="#F57A29"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M25.3 40.4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="#F57A29" />
                </g>
                <defs>
                  <clipPath id="a">
                    <rect width="49.7" height="49.7" fill="#fff" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div style={{ flex: "1 1 auto" }}>
              You see this template because the certificate issuer misconfigured the template configuration of your
              document. Please check with the certificate issuer. More information is available in{" "}
              <a
                style={{ color: "initial", textDecoration: "underline" }}
                href="https://openattestation.com/docs/advanced/custom-renderer"
                target="_blank"
                rel="noopener noreferrer"
              >
                the documentation
              </a>
              .
            </div>
          </div>
        </div>
        <pre
          style={{
            backgroundColor: "#f7f8fc",
            padding: paddingBox,
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          {JSON.stringify(props.document, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const defaultTemplate: TemplateWithComponent = {
  id: "default-template",
  label: "Default",
  template: DefaultTemplate,
};
