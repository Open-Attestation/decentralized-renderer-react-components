import React, { useCallback, useEffect, useRef, useState } from "react";
import { isActionOf } from "typesafe-actions";

import { HostActionsHandler, renderDocument, selectTemplate, print as printAction } from "./frame/host.actions";
import { FrameActions, obfuscateField, timeout, updateHeight, updateTemplates } from "./frame/frame.actions";
import { DisplayResult, SvgRenderer } from "./renderer/SvgRenderer";
import {
  V2OpenAttestationDocumentWithSvg,
  __unsafe__not__for__production__v2__SvgRenderer,
} from "./renderer/SvgV2Adapter";
import { FrameConnector } from "./frame/FrameConnector";
import { getData, obfuscate, utils, v2, v4 } from "@govtechsg/open-attestation";
import { DefaultTemplate } from "../DefaultTemplate";

type EmbeddedRendererConnectedResults = {
  type: "EMBEDDED_RENDERER";
  templates: { id: string; label: string }[];
  selectTemplate: (props: { id: string }) => void;
  selectedTemplateId: string;
  print: () => void;
  download: (filename: string) => void;
};
type SvgRendererConnectedResults = {
  type: "SVG_RENDERER";
  print: () => void;
};
export type ConnectedResults = EmbeddedRendererConnectedResults | SvgRendererConnectedResults;

type RendererError =
  | {
      type: "CONNECTION_TIMEOUT";
    }
  | {
      type: "NO_RENDER_METHOD_FOUND";
    }
  | { type: "UNSUPPORTED_DOCUMENT_VERSION" }
  | {
      type: "CONNECTION_TIMEOUT";
    }
  | { type: "SVG_LOAD_ERROR" }
  | { type: "SVG_FETCH_ERROR"; error: Error }
  | { type: "SVG_INVALID_MULTIBASE_DIGEST_ERROR" }
  | { type: "UNKNOWN_ERROR"; error?: Error };

type VersionedDocument =
  | {
      version: "2.0";
      wrappedDocument?: v2.WrappedDocument;
      document: v2.OpenAttestationDocument;
    }
  | {
      version: "4.0";
      document: v4.OpenAttestationDocument;
      wrappedDocument?: v4.WrappedDocument;
    };
function getVersionedDocument(
  document: v2.OpenAttestationDocument | v2.WrappedDocument | v4.OpenAttestationDocument
): VersionedDocument | { version: null } {
  if (utils.isWrappedV2Document(document)) {
    return {
      version: "2.0",
      wrappedDocument: document,
      document: getData(document),
    };
  } else if (utils.isRawV2Document(document)) {
    return {
      version: "2.0",
      document,
    };
  } else if (v4.isWrappedDocument(document)) {
    return {
      version: "4.0",
      document,
      wrappedDocument: document,
    };
  } else if (v4.isOpenAttestationDocument(document)) {
    return {
      version: "4.0",
      document,
    };
  }

  return {
    version: null,
  };
}

type RenderMethod =
  | { type: "NONE" }
  | {
      type: "SVG";
    }
  | { type: "EMBEDDED"; url: string; templateName: string };
function getRenderMethod(versionedDocument: VersionedDocument): RenderMethod {
  // we always prioritise svg renderer
  const isSvgRenderer =
    (versionedDocument.document as
      | Partial<V2OpenAttestationDocumentWithSvg>
      | v4.OpenAttestationDocument)?.renderMethod?.find(({ type }) => type === "SvgRenderingTemplate2023") !==
    undefined;

  if (isSvgRenderer) {
    return {
      type: "SVG",
    };
  }

  if (versionedDocument.version === "2.0") {
    if (typeof versionedDocument.document.$template === "object") {
      return {
        type: "EMBEDDED",
        url: versionedDocument.document.$template.url ?? "",
        templateName: versionedDocument.document.$template.name ?? "",
      };
    }
  } else {
    const embeddedRenderMethod = versionedDocument.document.renderMethod?.find(
      ({ type }) => type === "OpenAttestationEmbeddedRenderer"
    );

    if (embeddedRenderMethod && embeddedRenderMethod.type === "OpenAttestationEmbeddedRenderer") {
      return {
        type: "EMBEDDED",
        url: embeddedRenderMethod.id,
        templateName: embeddedRenderMethod.templateName,
      };
    }
  }

  return {
    type: "NONE",
  };
}

function printImageElement(image: HTMLImageElement) {
  const iframe = window.document.createElement("iframe");
  iframe.style.display = "none";
  window.document.body.appendChild(iframe);
  const iframeWindow = iframe.contentWindow;
  if (!iframeWindow) throw new Error("should not be undefined");
  iframeWindow.document.open();
  iframeWindow.document.write(image.outerHTML);
  iframeWindow.document.close();
  iframeWindow.focus();
  iframeWindow.print();
  iframeWindow.onafterprint = () => {
    window.document.body.removeChild(iframe);
  };
}

type TheSvgRendererProps = Omit<TheRendererProps, "document"> & {
  versionedDocument: VersionedDocument;
};
const TheSvgRenderer: React.FunctionComponent<TheSvgRendererProps> = ({
  versionedDocument,
  onConnected,
  onError,
  loadingComponent,
  ...rest
}) => {
  const svgRef = useRef<HTMLImageElement>(null);

  const onConnectedRef = useRef(onConnected);
  onConnectedRef.current = onConnected;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const onSvgRendererResult = useCallback((displayResult: DisplayResult) => {
    if (displayResult.status === "OK") {
      onConnectedRef.current({
        type: "SVG_RENDERER",
        print() {
          if (!svgRef.current) return;
          printImageElement(svgRef.current);
        },
      });
    } else {
      let rendererError: RendererError = { type: "UNKNOWN_ERROR" };
      switch (displayResult.status) {
        case "DIGEST_ERROR": {
          rendererError = { type: "SVG_INVALID_MULTIBASE_DIGEST_ERROR" };
          break;
        }
        case "FETCH_SVG_ERROR": {
          rendererError = { type: "SVG_FETCH_ERROR", error: displayResult.error };
          break;
        }
        case "SVG_LOAD_ERROR": {
          rendererError = { type: "SVG_LOAD_ERROR" };
          break;
        }
        default:
          rendererError = { type: "UNKNOWN_ERROR" };
      }
      onErrorRef.current?.(rendererError);
    }
  }, []);

  if (versionedDocument.version === "2.0") {
    return (
      <__unsafe__not__for__production__v2__SvgRenderer
        ref={svgRef}
        loadingComponent={loadingComponent}
        document={versionedDocument.document as V2OpenAttestationDocumentWithSvg}
        onResult={onSvgRendererResult}
        {...rest}
      />
    );
  }

  return (
    <SvgRenderer
      ref={svgRef}
      loadingComponent={loadingComponent}
      document={versionedDocument.document as any}
      onResult={onSvgRendererResult}
      {...rest}
    />
  );
};

const INIT_FRAME_HEIGHT = 0;
type TheEmbeddedRendererProps = TheSvgRendererProps & { frameSource: string };
const TheEmbeddedRenderer: React.FunctionComponent<TheEmbeddedRendererProps> = ({
  versionedDocument,
  frameSource,
  onError,
  onConnected,
  onObfuscation,
  loadingComponent,
  iframeSandbox,
  ...rest
}) => {
  const [iframeHeight, setIframeHeight] = useState(INIT_FRAME_HEIGHT);
  const [isFrameLoading, setFrameLoading] = useState(true);
  const dispatchToFrameRef = useRef<HostActionsHandler>();

  const obfuscatedDocumentRef = useRef<VersionedDocument & { isObfuscated?: boolean }>(versionedDocument);

  const onConnectedRef = useRef(onConnected);
  onConnectedRef.current = onConnected;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const onObfuscationRef = useRef(onObfuscation);
  onObfuscationRef.current = onObfuscation;

  const handleFrameConnected = useCallback((dispatchToFrame: HostActionsHandler) => {
    dispatchToFrameRef.current = (...params) => {
      try {
        dispatchToFrame(...params);
      } catch (error) {
        if (error instanceof Error && error.message.includes("destroyed connection")) {
          // the previous dispatch should not work any more, ignore
          return;
        }

        throw error;
      }
    };
    // this will trigger a rerender
    setFrameLoading(false);
  }, []);

  // runs whenever frame connected + new document
  useEffect(() => {
    if (!isFrameLoading && dispatchToFrameRef.current) {
      obfuscatedDocumentRef.current = versionedDocument;
      dispatchToFrameRef.current(
        renderDocument({
          document: versionedDocument.document,
          rawDocument: versionedDocument.wrappedDocument,
        })
      );
    }
  }, [versionedDocument, isFrameLoading]);

  const handleFrameActions = useCallback((action: FrameActions): void => {
    if (isActionOf(updateHeight, action)) {
      setIframeHeight(action.payload);
    }
    if (isActionOf(obfuscateField, action)) {
      let isObfuscated = false;
      if (obfuscatedDocumentRef.current.wrappedDocument) {
        if (obfuscatedDocumentRef.current.version === "2.0") {
          const obfuscated = obfuscate(obfuscatedDocumentRef.current.wrappedDocument, action.payload);
          if (obfuscatedDocumentRef.current.wrappedDocument) {
            obfuscatedDocumentRef.current.document = getData(obfuscated);
            obfuscatedDocumentRef.current.wrappedDocument = obfuscated;
            isObfuscated = true;
          }
        } else if (obfuscatedDocumentRef.current.wrappedDocument) {
          const obfuscated = obfuscate(obfuscatedDocumentRef.current.wrappedDocument, action.payload);
          obfuscatedDocumentRef.current.document = obfuscated;
          obfuscatedDocumentRef.current.wrappedDocument = obfuscated;
          isObfuscated = true;
        }
        if (isObfuscated) {
          obfuscatedDocumentRef.current.isObfuscated = true;
          dispatchToFrameRef.current?.(
            renderDocument({
              document: obfuscatedDocumentRef.current.document,
              rawDocument: obfuscatedDocumentRef.current.wrappedDocument,
            })
          );
          if (obfuscatedDocumentRef.current.wrappedDocument)
            onObfuscationRef.current?.({
              updatedDocument: obfuscatedDocumentRef.current.wrappedDocument,
              field: action.payload,
            });
        } else {
          console.debug(`Obfuscation of ${action.payload} is not possible without a wrapped document.`);
        }
      }
    }
    if (isActionOf(updateTemplates, action)) {
      // call on connected only if this is action is not a result from obfuscation
      if (!obfuscatedDocumentRef.current.isObfuscated) {
        const templates = action.payload;
        if (!dispatchToFrameRef.current) throw new Error("This should not happen");
        const selectedTemplateId = templates[0].id;
        dispatchToFrameRef.current(selectTemplate(selectedTemplateId));

        // call on connected here
        onConnectedRef.current({
          type: "EMBEDDED_RENDERER",
          templates,
          selectTemplate(props) {
            dispatchToFrameRef.current?.(selectTemplate(props.id));
          },
          selectedTemplateId,
          print() {
            dispatchToFrameRef.current?.(printAction());
          },
          download(filename: string) {
            downloadObject(
              obfuscatedDocumentRef.current.wrappedDocument ?? obfuscatedDocumentRef.current.document,
              filename
            );
          },
        });
      }
    }

    if (isActionOf(timeout, action)) {
      setFrameLoading(false);

      onErrorRef.current?.({
        type: "CONNECTION_TIMEOUT",
      });
    }
  }, []);

  return (
    <>
      {isFrameLoading && loadingComponent}
      <div {...rest}>
        <FrameConnector
          style={{
            height: iframeHeight + "px",
            width: "100%",
            display: isFrameLoading ? "none" : "block",
          }}
          source={frameSource}
          dispatch={handleFrameActions}
          onConnected={handleFrameConnected}
          onConnectionFailure={(setDocumentToRender) => {
            setDocumentToRender(document);
          }}
          sandbox={iframeSandbox}
        />
      </div>
    </>
  );
};

type TheRendererProps = {
  className?: string;
  style?: React.CSSProperties;
  document: v2.OpenAttestationDocument | v2.WrappedDocument | v4.OpenAttestationDocument;
  loadingComponent?: React.ReactNode;
  onConnected: (results: ConnectedResults) => void;
  onError?: (error: RendererError) => void;
  onObfuscation?: (props: { updatedDocument: v2.WrappedDocument | v4.WrappedDocument; field: string }) => void;
  iframeSandbox?: string;
};
export const TheRenderer: React.FunctionComponent<TheRendererProps> = ({ document, ...props }) => {
  const onErrorRef = useRef(props.onError);
  onErrorRef.current = props.onError;

  const parsed = React.useMemo(() => {
    const versionedDocument = getVersionedDocument(document);
    if (versionedDocument.version === null) {
      onErrorRef.current?.({
        type: "UNSUPPORTED_DOCUMENT_VERSION",
      });
      return null;
    }

    const renderMethod = getRenderMethod(versionedDocument);
    if (renderMethod.type === "NONE") {
      onErrorRef.current?.({
        type: "NO_RENDER_METHOD_FOUND",
      });
    }

    return {
      renderMethod,
      versionedDocument,
    };
  }, [document]);

  if (!parsed) {
    return (
      <DefaultTemplate
        title="Unsupported document version"
        description={
          <>
            The version of this document is not supported and hence cannot be rendered, this current display is
            intended.
          </>
        }
        document={document}
      />
    );
  }

  const { renderMethod, versionedDocument } = parsed;

  if (renderMethod.type === "NONE")
    return (
      <div className={props.className} style={props.style}>
        <DefaultTemplate
          title="No supported render method found"
          description={
            <>As the issuer did not design a template to display its contents, this current display is intended.</>
          }
          document={document}
        />
      </div>
    );

  if (renderMethod.type === "SVG") {
    return <TheSvgRenderer versionedDocument={versionedDocument} {...props} />;
  }

  return (
    <TheEmbeddedRenderer
      // We reset the entire thing when url or templateName has changed
      key={renderMethod.url + renderMethod.templateName}
      versionedDocument={versionedDocument}
      frameSource={renderMethod.url}
      {...props}
    />
  );
};

function downloadObject(object: unknown, filename: string) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(object, null, 2));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", filename);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
