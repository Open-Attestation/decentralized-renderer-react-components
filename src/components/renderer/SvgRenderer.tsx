import React, { CSSProperties, useEffect, useImperativeHandle, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Sha256 } from "@aws-crypto/sha256-browser";
import bs58 from "bs58";
import { ConnectionFailureTemplate, NoTemplate, TamperedSvgTemplate } from "../../DefaultTemplate";
import { v2 } from "@govtechsg/open-attestation";
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const handlebars = require("handlebars");

interface RenderMethod {
  id: string;
  type: string;
  name?: string;
  css3MediaQuery?: string;
  digestMultibase?: string;
}

// TODO: Replace temporary interface with v4.OpenAttestationDocument
export interface v4OpenAttestationDocument {
  credentialSubject: {
    id?: string;
    type?: string[] | string;
  };
  issuer: {
    id: string;
    identityProof: {
      identifier: string;
      identityProofType: v2.IdentityProofType;
    };
    name: string;
    type?: string[] | string;
  };
  renderMethod?: RenderMethod[];
}

interface SvgRendererProps {
  /** The OpenAttestation v4 document to display */
  document: v4OpenAttestationDocument; // TODO: Update to OpenAttestationDocument
  /** Override the img style */
  style?: CSSProperties;
  /** Override the img className */
  className?: string;
  // TODO: How to handle if svg fails at img? Currently it will return twice
  /** An optional callback method that returns the display result  */
  onResult?: (result: DisplayResult) => void;
}

/** Indicates the result of SVG rendering */
export enum DisplayResult {
  OK = 0,
  DEFAULT = 1,
  CONNECTION_ERROR = 2,
  DIGEST_ERROR = 3,
}

const fetchSvg = async (svgInDoc: string) => {
  try {
    const response = await fetch(svgInDoc);
    if (!response.ok) {
      throw new Error("Failed to fetch remote SVG");
    }
    const blob = await response.blob();
    const res = await blob.arrayBuffer();
    return res;
  } catch (error) {
    throw new Error("Failed to fetch SVG");
  }
};

// As specified in - https://w3c-ccg.github.io/vc-render-method/#svgrenderingtemplate2023
export const SVG_RENDERER_TYPE = "SvgRenderingTemplate2023";

/**
 * Component that accepts a v4 document to fetch and display the first available template SVG
 */
const SvgRenderer = React.forwardRef<HTMLIFrameElement, SvgRendererProps>(
  ({ document, style, className, onResult }, ref) => {
    const [svgFetchedData, setFetchedSvgData] = useState<string>("");
    const [toDisplay, setToDisplay] = useState<DisplayResult>(DisplayResult.OK);
    const svgRef = useRef<HTMLIFrameElement>(null);
    useImperativeHandle(ref, () => svgRef.current as HTMLIFrameElement);

    const renderMethod = document.renderMethod?.find((method) => method.type === SVG_RENDERER_TYPE);
    const svgInDoc = renderMethod?.id ?? "";
    const urlPattern = /^https?:\/\/.*\.svg$/;
    const isSvgUrl = urlPattern.test(svgInDoc);

    useEffect(() => {
      if (!("renderMethod" in document)) {
        handleResult(DisplayResult.DEFAULT);
        return;
      }

      if (!isSvgUrl) {
        // Case 1: SVG is embedded in the doc, can directly display
        handleResult(DisplayResult.OK, svgInDoc);
      } else {
        // Case 2: SVG is a url, fetch and check digestMultibase if provided
        fetchSvg(svgInDoc)
          .then((buffer) => {
            const digestMultibaseInDoc = renderMethod?.digestMultibase;
            const svgUint8Array = new Uint8Array(buffer ?? []);
            const decoder = new TextDecoder();
            const svgText = decoder.decode(svgUint8Array);

            if (!digestMultibaseInDoc) {
              handleResult(DisplayResult.OK, svgText);
            } else {
              const hash = new Sha256();
              hash.update(svgUint8Array);
              hash.digest().then((shaDigest) => {
                const recomputedDigestMultibase = "z" + bs58.encode(shaDigest); // manually prefix with 'z' as per https://w3c-ccg.github.io/multibase/#mh-registry
                if (recomputedDigestMultibase === digestMultibaseInDoc) {
                  handleResult(DisplayResult.OK, svgText);
                } else {
                  handleResult(DisplayResult.DIGEST_ERROR);
                }
              });
            }
          })
          .catch(() => {
            handleResult(DisplayResult.CONNECTION_ERROR);
          });
      }
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [document]);

    const handleResult = (result: DisplayResult, svgToSet = "") => {
      setFetchedSvgData(svgToSet);
      setToDisplay(result);
      setTimeout(() => {
        updateIframeHeight();
        if (typeof onResult === "function") {
          onResult(result);
        }
      }, 200); // wait for 200ms before manually updating the height
    };

    const renderTemplate = (template: string, document: any) => {
      if (template.length === 0) return "";
      const compiledTemplate = handlebars.compile(template);
      return document.credentialSubject ? compiledTemplate(document.credentialSubject) : compiledTemplate(document);
    };

    const compiledSvgData = `data:image/svg+xml,${encodeURIComponent(renderTemplate(svgFetchedData, document))}`;

    const updateIframeHeight = () => {
      if (svgRef.current) {
        const contentHeight = svgRef.current?.contentDocument?.body?.offsetHeight;
        svgRef.current.style.height = `${contentHeight}px`;
      }
    };

    const iframeContent = `
      <html>
          <head></head>
          <body style="margin: 0; display: flex; justify-content: center; align-items: center;">
          ${renderToStaticMarkup(
            <>{svgFetchedData !== "" ? <img src={compiledSvgData} alt="SVG document image" /> : <></>}</>
          )}
          </body>
      </html>`;

    switch (toDisplay) {
      case DisplayResult.DEFAULT:
        return <NoTemplate document={document} handleObfuscation={() => null} />;
      case DisplayResult.CONNECTION_ERROR:
        return <ConnectionFailureTemplate document={document} source={svgInDoc} />;
      case DisplayResult.DIGEST_ERROR:
        return <TamperedSvgTemplate document={document} />;
      case DisplayResult.OK:
        return (
          <iframe
            className={className}
            style={style}
            title="Svg Renderer Frame"
            width="100%"
            srcDoc={iframeContent}
            ref={svgRef}
          />
        );
      default:
        return <></>;
    }
  }
);

SvgRenderer.displayName = "SvgRendererComponent";

export { SvgRenderer };
