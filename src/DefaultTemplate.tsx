import React from "react";
import { TemplateProps, TemplateWithComponent } from "./types";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { utils } from "@govtechsg/open-attestation";
import JsonView from "@microlink/react-json-view";

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

interface TemplateInfo {
  name: string;
  type: string;
  url: string;
}

function extractTemplateInfo(document: TemplateProps["document"]): TemplateInfo | undefined {
  if (utils.isRawV2Document(document)) {
    // v2 document
    const template = document.$template;

    if (typeof template === "string") {
      // legacy open certs. uses centralised repository.
      return undefined;
    } else if (template !== undefined) {
      return {
        name: template.name,
        type: template.type,
        url: template.url ?? "",
      };
    }
  } else if (utils.isRawV3Document(document)) {
    // v3 document
    const template = document.openAttestationMetadata.template;
    if (template !== undefined) {
      return {
        name: template.name,
        type: template.type,
        url: template.url,
      };
    }
  }

  return undefined;
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
      <div style={{ ...container, fontFamily: "Arial", wordBreak: "break-all" }}>
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
          <JsonView
            style={{ marginTop: "32px" }}
            theme={{
              base00: "white",
              base01: "#ddd",
              base02: "#ddd",
              base03: "#444",
              base04: "purple",
              base05: "#444",
              base06: "#444",
              base07: "#000",
              base08: "#444",
              base09: "#057A55",
              base0A: "#057A55",
              base0B: "#057A55",
              base0C: "#000",
              base0D: "#057A55",
              base0E: "#057A55",
              base0F: "#057A55",
            }}
            src={props.document}
            displayObjectSize={false}
            displayDataTypes={false}
            collapseStringsAfterLength={200}
            enableClipboard={false}
          />
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
  const templateInfo = extractTemplateInfo(props.document);
  return (
    <DefaultTemplate
      title="This document has display issues"
      description={
        <>
          An incorrect template has been used for this document. Please contact the issuer with the information below:
          {templateInfo && (
            <>
              <br />
              <br />
              <Example template={templateInfo} />
            </>
          )}
        </>
      }
      document={props.document}
    />
  );
};

export const ConnectionFailureTemplate: React.FunctionComponent<ConnectionFailureProps> = (props) => {
  const templateInfo = props.document ? extractTemplateInfo(props.document) : undefined;
  return (
    <DefaultTemplate
      title="This document might be having loading issues"
      description={
        <>
          Try refreshing the page or check your internet connection. If the issue continues, please contact the issuer
          with the information below:
          <br />
          <br />
          {props.document && templateInfo ? (
            <Example template={templateInfo} />
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
