import React, { useCallback, useEffect, useRef, useState } from "react";
import { isActionOf } from "typesafe-actions";

import { HostActionsHandler } from "./frame/host.actions";
import { FrameActions, obfuscateField, timeout, updateHeight, updateTemplates } from "./frame/frame.actions";
import { DisplayResult, SvgRenderer } from "./renderer/SvgRenderer";
import {
  V2OpenAttestationDocumentWithSvg,
  __unsafe__not__for__production__v2__SvgRenderer,
} from "./renderer/SvgV2Adapter";
import { FrameConnector } from "./frame/FrameConnector";
import { getData, utils, v2, v4 } from "@govtechsg/open-attestation";
import { DefaultTemplate } from "../DefaultTemplate";

type EmbeddedRendererConnectedResults = {
  type: "EMBEDDED_RENDERER";
  templates: { id: string; label: string }[];
  selectTemplate: (props: { id: string }) => void;
  print: () => void;
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
  | { type: "SVG_LOAD_ERROR" }
  | { type: "SVG_FETCH_ERROR"; error: Error }
  | { type: "SVG_INVALID_MULTIBASE_DIGEST_ERROR" }
  | { type: "UNKNOWN_ERROR"; error?: Error };

type VersionedDocument =
  | {
      version: "2.0";
      rawDocument?: v2.WrappedDocument;
      document: v2.OpenAttestationDocument;
    }
  | {
      version: "4.0";
      document: v4.WrappedDocument;
    };
function getVersionedDocument(
  document: v2.OpenAttestationDocument | v2.WrappedDocument | v4.Document
): VersionedDocument | { version: null } {
  if (utils.isWrappedV2Document(document)) {
    return {
      version: "2.0",
      rawDocument: document,
      document: getData(document),
    };
  } else if (utils.isRawV2Document(document)) {
    return {
      version: "2.0",
      document,
    };
  } else if (v4.isDocument(document)) {
    return {
      version: "4.0",
      document: document as v4.WrappedDocument,
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
    (versionedDocument.document as Partial<V2OpenAttestationDocumentWithSvg> | v4.Document)?.renderMethod?.find(
      ({ type }) => type === "SvgRenderingTemplate2023"
    ) !== undefined;

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

    if (embeddedRenderMethod) {
      return {
        type: "EMBEDDED",
        url: embeddedRenderMethod.id,
        templateName: embeddedRenderMethod.type,
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
  const onSvgRendererResult = useCallback(
    (displayResult: DisplayResult) => {
      if (displayResult.status === "OK") {
        onConnected({
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
        onError(rendererError);
      }
    },
    [onConnected, onError]
  );

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

const INIT_FRAME_HEIGHT = 250;
type TheEmbeddedRendererProps = TheSvgRendererProps & { frameSource: string };
const TheEmbeddedRenderer: React.FunctionComponent<TheEmbeddedRendererProps> = ({
  versionedDocument,
  frameSource,
  onError,
  onConnected,
  onObfuscateField,
  loadingComponent,
  ...rest
}) => {
  const [iframeHeight, setIframeHeight] = useState(INIT_FRAME_HEIGHT);
  const [isFrameLoading, setFrameLoading] = useState(true);
  const dispatchToFrameRef = useRef<HostActionsHandler>();

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
      dispatchToFrameRef.current({
        type: "RENDER_DOCUMENT",
        payload: {
          document: versionedDocument.document,
          rawDocument: versionedDocument.version === "2.0" ? versionedDocument.rawDocument : versionedDocument.document,
        },
      });
    }
  }, [versionedDocument, isFrameLoading]);

  const handleFrameActions = useCallback(
    (action: FrameActions): void => {
      if (isActionOf(updateHeight, action)) {
        setIframeHeight(action.payload);
      }
      if (isActionOf(obfuscateField, action)) {
        onObfuscateField?.(action.payload);
      }
      if (isActionOf(updateTemplates, action)) {
        const templates = action.payload;
        if (!dispatchToFrameRef.current) throw new Error("This should not happen");
        dispatchToFrameRef.current({
          type: "SELECT_TEMPLATE",
          payload: templates[0].id,
        });

        // call on connected here
        onConnected({
          type: "EMBEDDED_RENDERER",
          templates,
          selectTemplate(props) {
            dispatchToFrameRef.current?.({
              type: "SELECT_TEMPLATE",
              payload: props.id,
            });
          },
          print() {
            dispatchToFrameRef.current?.({
              type: "PRINT",
            });
          },
        });
      }

      if (isActionOf(timeout, action)) {
        setFrameLoading(false);

        onError({
          type: "CONNECTION_TIMEOUT",
        });
      }
    },
    [onConnected, onError, onObfuscateField]
  );

  return (
    <>
      {isFrameLoading && loadingComponent}
      <div {...rest}>
        <FrameConnector
          style={{
            height: iframeHeight,
            width: "100%",
            display: isFrameLoading ? "none" : "block",
          }}
          source={frameSource}
          dispatch={handleFrameActions}
          onConnected={handleFrameConnected}
          onConnectionFailure={(setDocumentToRender) => {
            setDocumentToRender(document);
          }}
        />
      </div>
    </>
  );
};

type TheRendererProps = {
  className?: string;
  style?: React.CSSProperties;
  document: v2.OpenAttestationDocument | v2.WrappedDocument | v4.Document;
  loadingComponent?: React.ReactNode;
  onConnected: (results: ConnectedResults) => void;
  onError: (error: RendererError) => void;
  onObfuscateField?: (field: string) => void;
};
export const TheRenderer: React.FunctionComponent<TheRendererProps> = ({ document, ...rest }) => {
  const versionedDocument = React.useMemo(() => getVersionedDocument(document), [document]);

  if (versionedDocument.version === null) {
    return (
      <DefaultTemplate
        title="Version of document cannot be determined"
        description={
          <>
            The version of this document cannot be determined and hence cannot be rendered, this current display is
            intended.
          </>
        }
        document={document}
      />
    );
  }

  const renderMethod = getRenderMethod(versionedDocument);

  // TODO: can render default renderer here
  if (renderMethod.type === "NONE")
    return (
      <div className={rest.className} style={rest.style}>
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
    return <TheSvgRenderer versionedDocument={versionedDocument} {...rest} />;
  }

  return (
    <TheEmbeddedRenderer
      // We reset the entire thing when url or templateName has changed
      key={renderMethod.url + renderMethod.templateName}
      versionedDocument={versionedDocument}
      frameSource={renderMethod.url}
      {...rest}
    />
  );
};
