import { OpenAttestationDocument, v4 } from "@govtechsg/open-attestation";
import { base58btc } from "multiformats/bases/base58";
import { Digest } from "multiformats/dist/src/hashes/digest";
import { sha256 } from "multiformats/hashes/sha2";
import React, { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ConnectionFailureTemplate } from "../../DefaultTemplate";
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const handlebars = require("handlebars");

interface SvgRendererProps {
  svgOrUrl: string;
  document: OpenAttestationDocument;
  svgRef: React.RefObject<HTMLIFrameElement>;
  style?: CSSProperties;
  className?: string;
  sandbox?: string;
  onConnected?: () => void; // Optional call method to call once svg is loaded
}
export const SvgRenderer: FunctionComponent<SvgRendererProps> = ({
  svgOrUrl,
  document,
  svgRef,
  style,
  className,
  sandbox = "allow-same-origin",
  onConnected,
}) => {
  const [buffer, setBuffer] = useState<ArrayBuffer>();
  const [svgData, setSvgData] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [source, setSource] = useState<string>("");
  const docAsAny = document as any; // TODO: update type to v4.OpenAttestationDocument

  // 1. Fetch svg data from url if needed, if not directly proceed to checksum
  useEffect(() => {
    const urlPattern = /^(http(s)?:\/\/)?(www\.)?[\w-]+\.[\w]{2,}(\/[\w-]+)*\.svg$/;
    console.log(svgOrUrl);
    console.log(urlPattern.test(svgOrUrl));
    if (urlPattern.test(svgOrUrl)) {
      const fetchSvg = async () => {
        try {
          const response = await fetch(svgOrUrl);
          const blob = await response.blob();
          setBuffer(await blob.arrayBuffer());
        } catch (error) {
          setIsError(true);
        }
      };
      fetchSvg();
      setSource(svgOrUrl);
    } else {
      const textEncoder = new TextEncoder();
      const svgArrayBuffer = textEncoder.encode(svgOrUrl).buffer;
      setBuffer(svgArrayBuffer);
      setSource(docAsAny.renderMethod.id); // In the case where svg data is pre-fetched, manually set svg url as source
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [svgOrUrl]);

  // 2. Recompute and compare the digestMultibase if it is in the document, if not proceed to use the svg template
  useEffect(() => {
    if (!buffer) return;

    const digestMultibaseInDoc = docAsAny.renderMethod.digestMultibase;
    const svgUint8Array = new Uint8Array(buffer ?? []);
    const text = new TextDecoder().decode(svgUint8Array);

    if (digestMultibaseInDoc) {
      const shaDigest = sha256.digest(svgUint8Array) as Promise<Digest<18, number>>;
      shaDigest.then((res: any) => {
        const recomputedDigestMultibase = base58btc.encode(res.digest);
        console.log(`Original checksum is`, digestMultibaseInDoc);
        console.log(`Recomputed checksum is`, recomputedDigestMultibase);
        if (recomputedDigestMultibase === digestMultibaseInDoc) {
          setSvgData(text);
          setTimeout(() => {
            updateIframeHeight();
            if (typeof onConnected === "function") {
              onConnected();
            }
          }, 200);
        } else {
          setIsError(true);
        }
      });
    } else {
      setSvgData(text);
      setTimeout(() => {
        updateIframeHeight();
        if (typeof onConnected === "function") {
          onConnected();
        }
      }, 200);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [buffer]);

  const renderTemplate = (template: string, document: any) => {
    if (template.length === 0) return "";
    const v4doc = document as v4.OpenAttestationDocument;
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(v4doc.credentialSubject);
  };

  const compiledSvgData = `data:image/svg+xml,${encodeURIComponent(renderTemplate(svgData, document))}`;

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
          ${renderToStaticMarkup(<>{svgData ? <img src={compiledSvgData} alt="SVG document image" /> : <></>}</>)}
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
          title="Embedded Svg"
          width="100%"
          srcDoc={iframeContent}
          ref={svgRef}
          sandbox={sandbox}
        />
      )}
    </>
  );
};
