import React, { CSSProperties, useEffect, useState } from "react";
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

type InvalidSvgTemplateDisplayResult =
  | {
      status: "DEFAULT";
    }
  | {
      status: "DIGEST_ERROR";
    }
  | {
      status: "FETCH_SVG_ERROR";
      error: Error;
    };

type ValidSvgTemplateDisplayResult =
  | {
      status: "OK";
      svgDataUri: string;
    }
  | {
      status: "MALFORMED_SVG_ERROR";
      svgDataUri: string;
    };

type LoadingDisplayResult = {
  status: "LOADING";
};

export type DisplayResult = InvalidSvgTemplateDisplayResult | ValidSvgTemplateDisplayResult;

export interface SvgRendererProps {
  /** The OpenAttestation v4 document to display */
  document: v4OpenAttestationDocument; // TODO: Update to OpenAttestationDocument
  /** Override the img style */
  style?: CSSProperties;
  /** Override the img className */
  className?: string;
  // TODO: How to handle if svg fails at img? Currently it will return twice
  /** An optional callback method that returns the display result  */
  onResult?: (result: DisplayResult, err?: Error) => void;
}

const fetchSvg = async (svgInDoc: string, abortController: AbortController) => {
  const response = await fetch(svgInDoc, { signal: abortController.signal });
  if (!response.ok) {
    throw new Error("Failed to fetch remote SVG");
  }
  const blob = await response.blob();
  const res = await blob.arrayBuffer();
  return res;
};

// As specified in - https://w3c-ccg.github.io/vc-render-method/#svgrenderingtemplate2023
export const SVG_RENDERER_TYPE = "SvgRenderingTemplate2023";

/**
 * Component that accepts a v4 document to fetch and display the first available template SVG
 */
const SvgRenderer = React.forwardRef<HTMLImageElement, SvgRendererProps>(
  ({ document, style, className, onResult }, ref) => {
    const [svgFetchedData, setFetchedSvgData] = useState<string>("");
    const [toDisplay, setToDisplay] = useState<DisplayResult>(DisplayResult.OK);

    const renderMethod = document.renderMethod?.find((method) => method.type === SVG_RENDERER_TYPE);
    const svgInDoc = renderMethod?.id ?? "";
    const urlPattern = /^https?:\/\/.*\.svg$/;
    const isSvgUrl = urlPattern.test(svgInDoc);

    useEffect(() => {
      if (!("renderMethod" in document)) {
        handleResult(DisplayResult.DEFAULT);
        return;
      }
      const abortController = new AbortController();

      if (!isSvgUrl) {
        // Case 1: SVG is embedded in the doc, can directly display
        handleResult(DisplayResult.OK, svgInDoc);
      } else {
        // Case 2: SVG is a url, fetch and check digestMultibase if provided
        fetchSvg(svgInDoc, abortController)
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
          .catch((error) => {
            if ((error as Error).name !== "AbortError") {
              handleResult(DisplayResult.CONNECTION_ERROR, undefined, error);
            }
          });
      }
      return () => {
        abortController.abort();
      };
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [document]);

    const handleResult = (result: DisplayResult, svgToSet = "", error?: Error) => {
      setFetchedSvgData(svgToSet);
      setToDisplay(result);
      if (typeof onResult === "function") {
        onResult(result, error);
      }
    };

    const renderTemplate = (template: string, document: any) => {
      if (template.length === 0) return "";
      const compiledTemplate = handlebars.compile(template);
      return document.credentialSubject ? compiledTemplate(document.credentialSubject) : compiledTemplate(document);
    };

    const compiledSvgData = `data:image/svg+xml,${encodeURIComponent(renderTemplate(svgFetchedData, document))}`;

    switch (toDisplay) {
      case DisplayResult.DEFAULT:
        return <NoTemplate document={document} handleObfuscation={() => null} />;
      case DisplayResult.CONNECTION_ERROR:
        return <ConnectionFailureTemplate document={document} source={svgInDoc} />;
      case DisplayResult.DIGEST_ERROR:
        return <TamperedSvgTemplate document={document} />;
      case DisplayResult.OK:
        return (
          <img
            className={className}
            style={style}
            title="Svg Renderer Image"
            width="100%"
            src={compiledSvgData}
            ref={ref}
            alt="Svg image of the verified document"
          />
        );
      default:
        return <></>;
    }
  }
);

SvgRenderer.displayName = "SvgRendererComponent";

export { SvgRenderer };
