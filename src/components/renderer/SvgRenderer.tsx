import React, { CSSProperties, useEffect, useState } from "react";
import { Sha256 } from "@aws-crypto/sha256-browser";
import bs58 from "bs58";
import { ConnectionFailureTemplate, DefaultTemplate, NoTemplate, TamperedSvgTemplate } from "../../DefaultTemplate";
import type { v2 } from "@govtechsg/open-attestation";
import handlebars from "handlebars";

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
      status: "SVG_LOAD_ERROR";
      svgDataUri: string;
    };

type PendingImgLoadDisplayResult = {
  status: "PENDING_OK";
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
  /** An optional callback method that returns the display result  */
  onResult?: (result: DisplayResult, err?: Error) => void;
  /** An optional component to display while loading */
  loadingComponent?: React.ReactNode;
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

const renderSvg = (template: string, document: any) => {
  if (template.length === 0) return "";
  const compiledTemplate = handlebars.compile(template);
  return document.credentialSubject ? compiledTemplate(document.credentialSubject) : compiledTemplate(document);
};

// As specified in - https://w3c-ccg.github.io/vc-render-method/#svgrenderingtemplate2023
export const SVG_RENDERER_TYPE = "SvgRenderingTemplate2023";

/**
 * Component that accepts a v4 document to fetch and display the first available template SVG
 */
const SvgRenderer = React.forwardRef<HTMLImageElement, SvgRendererProps>(
  ({ document, style, className, onResult, loadingComponent }, ref) => {
    const [toDisplay, setToDisplay] = useState<DisplayResult | LoadingDisplayResult | PendingImgLoadDisplayResult>({
      status: "LOADING",
    });

    const renderMethod = document.renderMethod?.find((method) => method.type === SVG_RENDERER_TYPE);
    const svgInDoc = renderMethod?.id ?? "";
    useEffect(() => {
      setToDisplay({ status: "LOADING" });

      /** for what ever reason, the SVG template is missing or invalid */
      const handleInvalidSvgTemplate = (result: InvalidSvgTemplateDisplayResult) => {
        setToDisplay(result);
        onResult?.(result);
      };

      /** we have everything we need to generate the svg data uri, but we do not know if
       * it is malformed/blocked by CORS or not until it is loaded by the image element,
       * hence we do not call onResult here, instead we call it in the img onLoad and
       * onError handlers
       */
      const handleValidSvgTemplate = (rawSvgTemplate: string) => {
        setToDisplay({
          status: "PENDING_OK",
          svgDataUri: `data:image/svg+xml,${encodeURIComponent(renderSvg(rawSvgTemplate, document))}`,
        });
      };

      if (renderMethod === undefined) {
        handleInvalidSvgTemplate({
          status: "DEFAULT",
        });
        return;
      }
      const abortController = new AbortController();

      const urlPattern = /^https?:\/\/.*\.svg$/;
      const isSvgUrl = urlPattern.test(svgInDoc);
      if (!isSvgUrl) {
        // Case 1: SVG is embedded in the doc, can directly display
        handleValidSvgTemplate(svgInDoc);
      } else {
        // Case 2: SVG is a url, fetch and check digestMultibase if provided
        fetchSvg(svgInDoc, abortController)
          .then((buffer) => {
            const digestMultibaseInDoc = renderMethod?.digestMultibase;
            const svgUint8Array = new Uint8Array(buffer ?? []);
            const decoder = new TextDecoder();
            const rawSvgTemplate = decoder.decode(svgUint8Array);

            if (!digestMultibaseInDoc) {
              handleValidSvgTemplate(rawSvgTemplate);
            } else {
              const hash = new Sha256();
              hash.update(svgUint8Array);
              hash.digest().then((shaDigest) => {
                const recomputedDigestMultibase = "z" + bs58.encode(shaDigest); // manually prefix with 'z' as per https://w3c-ccg.github.io/multibase/#mh-registry
                if (recomputedDigestMultibase === digestMultibaseInDoc) {
                  handleValidSvgTemplate(rawSvgTemplate);
                } else {
                  handleInvalidSvgTemplate({
                    status: "DIGEST_ERROR",
                  });
                }
              });
            }
          })
          .catch((error) => {
            if ((error as Error).name !== "AbortError") {
              handleInvalidSvgTemplate({
                status: "FETCH_SVG_ERROR",
                error,
              });
            }
          });
      }
      return () => {
        abortController.abort();
      };
    }, [document, onResult, svgInDoc, renderMethod]);

    const handleImgResolved = (result: ValidSvgTemplateDisplayResult) => () => {
      setToDisplay(result);
      onResult?.(result);
    };

    switch (toDisplay.status) {
      case "LOADING":
        return loadingComponent ? <>{loadingComponent}</> : null;
      case "SVG_LOAD_ERROR":
        return (
          <DefaultTemplate
            title="The resolved SVG could not be loaded"
            description={<>The resolved SVG is either blocked or malformed. Please contact the issuer.</>}
            document={document}
          />
        );
      case "FETCH_SVG_ERROR":
        return <ConnectionFailureTemplate document={document} source={svgInDoc} />;
      case "DIGEST_ERROR":
        return <TamperedSvgTemplate document={document} />;
      case "PENDING_OK":
      case "OK": {
        return (
          <img
            className={className}
            style={
              toDisplay.status === "PENDING_OK"
                ? {
                    display: "none",
                  }
                : style
            }
            title="Svg Renderer Image"
            src={toDisplay.svgDataUri}
            ref={ref}
            alt="Svg image of the verified document"
            onLoad={handleImgResolved({ status: "OK", svgDataUri: toDisplay.svgDataUri })}
            onError={handleImgResolved({ status: "SVG_LOAD_ERROR", svgDataUri: toDisplay.svgDataUri })}
          />
        );
      }
      default:
        return <NoTemplate document={document} handleObfuscation={() => null} />;
    }
  }
);

SvgRenderer.displayName = "SvgRendererComponent";

export { SvgRenderer };
