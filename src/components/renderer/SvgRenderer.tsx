import { OpenAttestationDocument, v2, v4, utils } from "@govtechsg/open-attestation";
import React, { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TextEncoder, TextDecoder } from "util";
import crypto from "crypto";
import bs58 from "bs58";
import { ConnectionFailureTemplate } from "../../DefaultTemplate";
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const handlebars = require("handlebars");

interface SvgRendererProps {
  document: v2.OpenAttestationDocument | v4.OpenAttestationDocument;
  svgRef: React.RefObject<HTMLIFrameElement>;
  svgData?: string;
  style?: CSSProperties;
  className?: string;
  sandbox?: string;
  onConnected?: () => void; // Optional call method to call once svg is loaded
  forceV2?: boolean;
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
  const [isError, setIsError] = useState<boolean>(false);
  const [source, setSource] = useState<string>("");
  let docAsAny: any;
  if (forceV2 && utils.isRawV2Document(docAsAny)) {
    docAsAny = document as v2.OpenAttestationDocument;
  } else {
    docAsAny = document as any; // TODO: update type to v4.OpenAttestationDocument
  }

  // 1. Fetch svg data from url if needed, if not directly proceed to checksum
  useEffect(() => {
    const svgInDoc = docAsAny.renderMethod.id;
    const urlPattern = /^(http(s)?:\/\/)?(www\.)?[\w-]+\.[\w]{2,}(\/[\w-]+)*\.svg$/;
    const isSvgUrl = urlPattern.test(svgInDoc);

    if (svgData) {
      const textEncoder = new TextEncoder();
      const svgArrayBuffer = textEncoder.encode(svgData).buffer;
      setBuffer(svgArrayBuffer);
      setSource(isSvgUrl ? svgInDoc : "[Embedded SVG]"); // In case svg data is passed over despite being embedded
    } else if (isSvgUrl) {
      const fetchSvg = async () => {
        try {
          const response = await fetch(svgInDoc);
          console.log(response);
          const blob = await response.blob();
          console.log(blob);
          setBuffer(await blob.arrayBuffer());
        } catch (error) {
          console.log(error);
          setIsError(true);
        }
      };
      fetchSvg();
      setSource(svgData);
    } else {
      setSvgDataAndTriggerCallback(svgInDoc); // Can directly display if svg is embedded
      setSource("[Embedded SVG]");
    }

    // if (urlPattern.test(svgData)) {
    //   const fetchSvg = async () => {
    //     try {
    //       const response = await fetch(svgData);
    //       console.log(response);
    //       const blob = await response.blob();
    //       console.log(blob);
    //       setBuffer(await blob.arrayBuffer());
    //     } catch (error) {
    //       console.log(error);
    //       setIsError(true);
    //     }
    //   };
    //   fetchSvg();
    //   setSource(svgData);
    // } else {
    //   const textEncoder = new TextEncoder();
    //   const svgArrayBuffer = textEncoder.encode(svgData).buffer;
    //   setBuffer(svgArrayBuffer);
    //   setSource("[Embedded SVG]");
    // }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [svgData]);

  const setSvgDataAndTriggerCallback = (svgToSet: string) => {
    setFetchedSvgData(svgToSet);
    setTimeout(() => {
      updateIframeHeight();
      if (typeof onConnected === "function") {
        onConnected();
      }
    }, 200); // wait for 200ms before manually updating the height
  };

  // 2. Recompute and compare the digestMultibase if it is in the document, if not proceed to use the svg template
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
        setIsError(true);
      }
    } else {
      setSvgDataAndTriggerCallback(text);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [buffer]);

  const renderTemplate = (template: string, document: any, forceV2: boolean) => {
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

  const compiledSvgData = `data:image/svg+xml,${encodeURIComponent(renderTemplate(svgFetchedData, document, forceV2))}`;

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

  return (
    <>
      {isError ? (
        <ConnectionFailureTemplate document={document} source={source} />
      ) : (
        <iframe
          className={className}
          style={style}
          title="Svg Renderer Frame"
          width="100%"
          srcDoc={iframeContent}
          ref={svgRef}
          sandbox={sandbox}
        />
      )}
    </>
  );
};
