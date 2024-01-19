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

const container = {
  maxWidth: "1024px",
  marginRight: "auto",
  marginLeft: "auto",
  paddingRight: "1rem",
  paddingLeft: "1rem",
};

const textColor = `#333`;
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
    <div id="default-template" style={{ fontFamily: "Arial" }}>
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
          {props.document && (
            <>
              <br />
              <br />
              <Example template={extractTemplateInfo(props.document)} />
            </>
          )}
        </>
      }
      document={props.document}
    />
  );
};

// export const DefaultTemplate: React.FunctionComponent<TemplateProps> = (props) => {
//   return (
//     <div id="default-template">
//       <div style={{ ...container, ...{ color: textColor } }}>
//         <h1
//           style={{
//             fontSize: "26px",
//           }}
//         >
//           This is the OpenAttestation default renderer
//         </h1>
//         <div
//           role="alert"
//           style={{
//             marginTop: "1.5rem",
//             marginBottom: "1.5rem",
//             backgroundColor: "#fffbec",
//             padding: paddingBox,
//           }}
//         >
//           <div style={{ display: "flex", flexWrap: "nowrap", flexDirection: "row", alignItems: "center" }}>
//             <div style={{ flex: "0 0 50px", marginRight: "24px" }}>
//               <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
//                 <g clipPath="url(#a)">
//                   <path
//                     d="m47.7 19.6.3 2.1c.7 5-.3 10.1-2.8 14.4-2.5 4.4-6.3 7.9-10.9 9.9-4.6 2.1-9.7 2.6-14.6 1.5s-9.3-3.8-12.6-7.6c-3.3-3.8-5.2-8.6-5.6-13.6-.3-5 1-10 3.7-14.2C8 7.9 12 4.7 16.7 3c4.7-1.7 9.9-1.9 14.7-.5M25.3 10.9v21"
//                     stroke="#F57A29"
//                     strokeWidth="3"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                   <path d="M25.3 40.4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="#F57A29" />
//                 </g>
//                 <defs>
//                   <clipPath id="a">
//                     <rect width="49.7" height="49.7" fill="#fff" />
//                   </clipPath>
//                 </defs>
//               </svg>
//             </div>
//             <div style={{ flex: "1 1 auto" }}>
//               You see this template because the certificate issuer misconfigured the template configuration of your
//               document. Please check with the certificate issuer. More information is available in{" "}
//               <a
//                 style={{ color: "initial", textDecoration: "underline" }}
//                 href="https://openattestation.com/docs/advanced/custom-renderer"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 the documentation
//               </a>
//               .
//             </div>
//           </div>
//         </div>
//         <pre
//           style={{
//             backgroundColor: "#f7f8fc",
//             padding: paddingBox,
//             whiteSpace: "pre-wrap",
//             wordWrap: "break-word",
//           }}
//         >
//           {JSON.stringify(props.document, null, 2)}
//         </pre>
//       </div>
//     </div>
//   );
// };

export const wrongTemplate: TemplateWithComponent = {
  id: "default-template", // whats this for? does it matter?
  label: "Default",
  template: WrongTemplate,
};

export const noTemplate: TemplateWithComponent = {
  id: "default-template", // whats this for? does it matter?
  label: "Default",
  template: NoTemplate,
};
