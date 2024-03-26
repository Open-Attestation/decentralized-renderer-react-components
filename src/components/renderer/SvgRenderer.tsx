import { OpenAttestationDocument, v2, v4, utils } from "@govtechsg/open-attestation";
import React, { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TextEncoder, TextDecoder } from "util";
import crypto from "crypto";
import bs58 from "bs58";
import { ConnectionFailureTemplate, NoTemplate, TamperedSvgTemplate } from "../../DefaultTemplate";
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const handlebars = require("handlebars");

interface SvgRendererProps {
  document: OpenAttestationDocument;
  svgRef: React.RefObject<HTMLIFrameElement>;
  svgData?: string;
  style?: CSSProperties;
  className?: string;
  sandbox?: string;
  onConnected?: () => void; // Optional call method to call once svg is loaded
  forceV2?: boolean;
}

const EMBEDDED_DOCUMENT = "[Embedded SVG]";

enum DisplayResult {
  OK = 0,
  DEFAULT = 1,
  CONNECTION_ERROR = 2,
  DIGEST_ERROR = 3,
}

export const SvgRenderer: FunctionComponent<SvgRendererProps> = ({
  document,
  svgRef,
  svgData,
  style,
  className,
  sandbox = "allow-same-origin",
  onConnected,
  forceV2 = false,
}) => {
  const [buffer, setBuffer] = useState<ArrayBuffer>();
  const [svgFetchedData, setFetchedSvgData] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [toDisplay, setToDisplay] = useState<DisplayResult>(DisplayResult.OK);

  let docAsAny: any;
  if (forceV2 && utils.isRawV2Document(docAsAny)) {
    docAsAny = document as v2.OpenAttestationDocument;
  } else {
    docAsAny = document as any; // TODO: update type to v4.OpenAttestationDocument
  }

  // Step 1: Fetch svg data if needed
  useEffect(() => {
    if (!("renderMethod" in docAsAny)) {
      setToDisplay(DisplayResult.DEFAULT);
      return;
    }

    const svgInDoc = docAsAny.renderMethod.id;
    const urlPattern = /^(http(s)?:\/\/)?(www\.)?[\w-]+\.[\w]{2,}(\/[\w-]+)*\.svg$/;
    const isSvgUrl = urlPattern.test(svgInDoc);

    if (svgData) {
      // Case 1: Svg data is pre-fetched and passed as a prop
      const textEncoder = new TextEncoder();
      const svgArrayBuffer = textEncoder.encode(svgData).buffer;
      setBuffer(svgArrayBuffer);
      setSource(isSvgUrl ? svgInDoc : EMBEDDED_DOCUMENT); // In case svg data is passed over despite being embedded
    } else if (isSvgUrl) {
      // Case 2: Fetch svg data from url in document
      const fetchSvg = async () => {
        try {
          const response = await fetch(svgInDoc);
          console.log(response);
          if (!response.ok) {
            throw new Error("Failed to fetch remote SVG");
          }
          const blob = await response.blob();
          console.log(blob);
          setBuffer(await blob.arrayBuffer());
        } catch (error) {
          console.log(error);
          setToDisplay(DisplayResult.CONNECTION_ERROR);
        }
      };
      fetchSvg();
      setSource(svgInDoc);
    } else {
      // Case 3: Display embedded svg data directly from document
      setSvgDataAndTriggerCallback(svgInDoc);
      setSource(EMBEDDED_DOCUMENT);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [document]);

  const setSvgDataAndTriggerCallback = (svgToSet: string) => {
    setFetchedSvgData(svgToSet);
    setToDisplay(DisplayResult.OK);
    setTimeout(() => {
      updateIframeHeight();
      if (typeof onConnected === "function") {
        onConnected();
      }
    }, 200); // wait for 200ms before manually updating the height
  };

  // Step 2: Recompute and compare the digestMultibase if present, if not proceed to use the svg template
  useEffect(() => {
    if (!buffer) return;

    const digestMultibaseInDoc = docAsAny.renderMethod.digestMultibase;
    const svgUint8Array = new Uint8Array(buffer ?? []);
    const decoder = new TextDecoder();
    const text = decoder.decode(svgUint8Array);

    if (digestMultibaseInDoc) {
      const shaDigest = crypto.createHash("sha256").update(svgUint8Array).digest();
      const recomputedDigestMultibase = "z" + bs58.encode(shaDigest); // manually prefix with 'z' as per https://w3c-ccg.github.io/multibase/#mh-registry
      console.log(`Original checksum is`, digestMultibaseInDoc);
      console.log(`Recomputed checksum is`, recomputedDigestMultibase);
      if (recomputedDigestMultibase === digestMultibaseInDoc) {
        setSvgDataAndTriggerCallback(text);
      } else {
        setToDisplay(DisplayResult.DIGEST_ERROR);
      }
    } else {
      setSvgDataAndTriggerCallback(text);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [buffer]);

  // Step 3: Compile final svg
  const renderTemplate = (template: string, document: any) => {
    if (template.length === 0) return "";
    if (forceV2 && utils.isRawV2Document(document)) {
      const v2doc = document as v2.OpenAttestationDocument;
      const compiledTemplate = handlebars.compile(template);
      return compiledTemplate(v2doc);
    } else {
      const v4doc = document as v4.OpenAttestationDocument;
      const compiledTemplate = handlebars.compile(template);
      return compiledTemplate(v4doc.credentialSubject);
    }
  };

  const compiledSvgData = `data:image/svg+xml,${encodeURIComponent(renderTemplate(svgFetchedData, document))}`;

  const updateIframeHeight = () => {
    if (svgRef.current) {
      const contentHeight = svgRef.current?.contentDocument?.body?.offsetHeight;
      console.log(`updating height to`, svgRef.current?.contentDocument?.body?.offsetHeight);
      svgRef.current.style.height = `${contentHeight}px`;
    }
  };

  const iframeContent = `
      <html>
          <head></head>
          <body style="margin: 0; display: flex; justify-content: center; align-items: center;">
          ${renderToStaticMarkup(
            <>{svgFetchedData ? <img src={compiledSvgData} alt="SVG document image" /> : <></>}</>
          )}
          </body>
      </html>`;

  switch (toDisplay) {
    case DisplayResult.DEFAULT:
      return <NoTemplate document={docAsAny} handleObfuscation={() => null} />;
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
          sandbox={sandbox}
        />
      );
    default:
      return <></>;
  }
};
