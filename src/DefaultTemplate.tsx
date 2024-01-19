import React from "react";
import { TemplateProps, TemplateWithComponent } from "./types";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";

interface DefaultTemplateProps {
  title: string;
  description: EmotionJSX.Element;
  document?: TemplateProps["document"];
}

interface ConnectionFailureProps {
  source: string;
  document?: TemplateProps["document"];
}

const DEFAULT_ID = "default-template";

const container = {
  maxWidth: "1024px",
  marginRight: "auto",
  marginLeft: "auto",
  paddingRight: "1rem",
  paddingLeft: "1rem",
};

const paddingBox = `.75rem 1.25rem`;

function extractTemplateInfo(document: TemplateProps["document"]) {
  let name = "";
  let type = "";
  let url = "";

  if ("$template" in document) {
    // v2 document
    const template = document.$template;

    if (typeof template === "string") {
      // legacy open certs. uses centralised repository.
    } else if (template !== undefined) {
      name = template.name;
      type = template.type;
      url = template.url ?? "";
    }
  } else if ("openAttestationMetadata" in document) {
    // v3 document
    const template = document.openAttestationMetadata.template;
    if (template !== undefined) {
      name = template.name;
      type = template.type;
      url = template.url;
    }
  }

  return { name, type, url };
}

interface ExampleProps {
  template: {
    name: string;
    type: string;
    url: string;
  };
}

const Example: React.FunctionComponent<ExampleProps> = ({ template }) => {
  return (
    <span style={{ fontFamily: "Courier" }}>
      Template Name : “{template.name}”
      <br />
      Type: “{template.type}”
      <br />
      URL: “{template.url}”
    </span>
  );
};

export const DefaultTemplate: React.FunctionComponent<DefaultTemplateProps> = (props) => {
  return (
    <div id={DEFAULT_ID}>
      <div style={{ ...container, fontFamily: "Arial" }}>
        {/* Banner */}
        <div style={{ backgroundColor: "#FDFDEA", borderLeft: "2px solid #8E4B10", padding: "16px 16px 16px 18px" }}>
          <p style={{ margin: "0px", lineHeight: "21px", fontSize: "16px", color: "#8E4B10", fontWeight: "700" }}>
            {props.title}
          </p>
          <p style={{ margin: "0px", lineHeight: "21px", fontSize: "14px", color: "#374151", marginTop: "6px" }}>
            {props.description}
          </p>
        </div>

        {/* plain text preview */}
        {props.document && (
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
        )}
      </div>
    </div>
  );
};

export const NoTemplate: React.FunctionComponent<TemplateProps> = (props) => {
  return (
    <DefaultTemplate
      title="This document is displayed in plain text"
      description={<>As this document does not have a template, the current display is intended.</>}
      document={props.document}
    />
  );
};

export const WrongTemplate: React.FunctionComponent<TemplateProps> = (props) => {
  return (
    <DefaultTemplate
      title="This document has display issues"
      description={
        <>
          An incorrect template has been used for this document. Please contact the issuer with the information below:
          <br />
          <br />
          <Example template={extractTemplateInfo(props.document)} />
        </>
      }
      document={props.document}
    />
  );
};

export const ConnectionFailureTemplate: React.FunctionComponent<ConnectionFailureProps> = (props) => {
  return (
    <DefaultTemplate
      title="This document might be having loading issues"
      description={
        <>
          Try refreshing the page or check your internet connection. If the issue continues, please contact the issuer
          with the information below:
          <br />
          <br />
          {props.document ? (
            <Example template={extractTemplateInfo(props.document)} />
          ) : (
            <span style={{ fontFamily: "Courier" }}>Template URL: “{props.source}”</span>
          )}
        </>
      }
      document={props.document}
    />
  );
};

export const wrongTemplate: TemplateWithComponent = {
  id: DEFAULT_ID,
  label: "Default",
  template: WrongTemplate,
};

export const noTemplate: TemplateWithComponent = {
  id: DEFAULT_ID,
  label: "Default",
  template: NoTemplate,
};
