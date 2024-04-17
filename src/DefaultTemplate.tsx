import React from "react";
import { TemplateProps, TemplateWithComponent } from "./types";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { isV2Document, isV3Document, isV4Document } from "./utils";
import { JsonView } from "./JsonView";
import { v4OpenAttestationDocument } from "./components/renderer/SvgRenderer";

interface DefaultTemplateProps {
  title: string;
  description: EmotionJSX.Element;
  document?: TemplateProps["document"];
}

interface ConnectionFailureProps {
  source: string;
  document?: TemplateProps["document"];
}

interface SvgModifiedProps {
  document: TemplateProps["document"];
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

export function extractTemplateInfo(document: TemplateProps["document"]): TemplateInfo | undefined {
  if (isV2Document(document)) {
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
  } else if (isV3Document(document)) {
    const template = document.openAttestationMetadata.template;
    if (template !== undefined) {
      return {
        name: template.name,
        type: template.type,
        url: template.url,
      };
    }
  } else if (isV4Document(document)) {
    const docAsAny = document as v4OpenAttestationDocument; // TODO: Update to v4
    const renderMethod = docAsAny.renderMethod?.find((method) => method.type === "SvgRenderingTemplate2023");
    if (renderMethod !== undefined) {
      return {
        name: renderMethod.name ?? "",
        type: renderMethod.type,
        url: renderMethod.id,
      };
    }
  }

  return undefined;
}

interface TemplateInfoComponentProps {
  template: {
    name: string;
    type: string;
    url: string;
  };
}

const TemplateInfoComponent: React.FunctionComponent<TemplateInfoComponentProps> = ({ template }) => {
  return (
    <span style={{ fontFamily: "Courier" }} data-testid={"template-info"}>
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
    <div id={DEFAULT_ID} data-testid={DEFAULT_ID}>
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
        {props.document && <JsonView src={props.document} />}
      </div>
    </div>
  );
};

export const NoTemplate: React.FunctionComponent<TemplateProps> = (props) => {
  return (
    <DefaultTemplate
      title="The contents of this document have not been formatted"
      description={
        <>As the issuer did not design a template to display its contents, this current display is intended.</>
      }
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
              <TemplateInfoComponent template={templateInfo} />
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
            <TemplateInfoComponent template={templateInfo} />
          ) : (
            <span style={{ fontFamily: "Courier" }}>Template URL: “{props.source}”</span>
          )}
        </>
      }
      document={props.document}
    />
  );
};

export const TamperedSvgTemplate: React.FunctionComponent<SvgModifiedProps> = (props) => {
  const templateInfo = extractTemplateInfo(props.document);
  return (
    <DefaultTemplate
      title="The remote content for this document has been modified"
      description={
        <>
          The display for this document has been modified and no longer matches its original state. Please contact the
          issuer with the information below:
          {templateInfo && (
            <>
              <br />
              <br />
              <TemplateInfoComponent template={templateInfo} />
            </>
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
