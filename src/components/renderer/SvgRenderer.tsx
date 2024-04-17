import React, { CSSProperties, useEffect, useImperativeHandle, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Sha256 } from "@aws-crypto/sha256-browser";
import bs58 from "bs58";
import { ConnectionFailureTemplate, NoTemplate, TamperedSvgTemplate } from "../../DefaultTemplate";
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const handlebars = require("handlebars");

interface SvgRendererProps {
  document: any; // TODO: Update to OpenAttestationDocument
  style?: CSSProperties;
  className?: string;
  onResult?: (result: DisplayResult) => void;
}

const EMBEDDED_IN_DOCUMENT = "[Embedded SVG]";

enum DisplayResult {
  OK = 0,
  DEFAULT = 1,
  CONNECTION_ERROR = 2,
  DIGEST_ERROR = 3,
}

const SvgRenderer = React.forwardRef<HTMLIFrameElement, SvgRendererProps>(
  ({ document, style, className, onResult }, ref) => {
    const [svgFetchedData, setFetchedSvgData] = useState<string>("");
    const [source, setSource] = useState<string>("");
    const [toDisplay, setToDisplay] = useState<DisplayResult>(DisplayResult.OK);
    const svgRef = useRef<HTMLIFrameElement>(null);
    useImperativeHandle(ref, () => svgRef.current as HTMLIFrameElement);

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
        setSvgDataAndTriggerCallback(DisplayResult.CONNECTION_ERROR);
      }
    };

    useEffect(() => {
      if (!("renderMethod" in document)) {
        setSvgDataAndTriggerCallback(DisplayResult.DEFAULT);
        return;
      }

      const svgInDoc = document.renderMethod.id;
      const urlPattern = /^https?:\/\/.*\.svg$/;
      const isSvgUrl = urlPattern.test(svgInDoc);

      if (isSvgUrl) {
        fetchSvg(svgInDoc).then((buffer) => {
          if (!buffer) return;

          const digestMultibaseInDoc = document.renderMethod.digestMultibase;
          const svgUint8Array = new Uint8Array(buffer ?? []);
          const decoder = new TextDecoder();
          const svgText = decoder.decode(svgUint8Array);

          if (digestMultibaseInDoc) {
            const hash = new Sha256();
            hash.update(svgUint8Array);
            hash.digest().then((shaDigest) => {
              const recomputedDigestMultibase = "z" + bs58.encode(shaDigest); // manually prefix with 'z' as per https://w3c-ccg.github.io/multibase/#mh-registry
              if (recomputedDigestMultibase === digestMultibaseInDoc) {
                setSvgDataAndTriggerCallback(DisplayResult.OK, svgText);
              } else {
                setSvgDataAndTriggerCallback(DisplayResult.DIGEST_ERROR);
              }
            });
          } else {
            setSvgDataAndTriggerCallback(DisplayResult.OK, svgText);
          }
        });
        setSource(svgInDoc);
      } else {
        setSvgDataAndTriggerCallback(DisplayResult.OK, svgInDoc);
        setSource(EMBEDDED_IN_DOCUMENT);
      }
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [document]);

    const setSvgDataAndTriggerCallback = (result: DisplayResult, svgToSet = "") => {
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
        return <ConnectionFailureTemplate document={document} source={source} />;
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
