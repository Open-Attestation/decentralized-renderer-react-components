import React, { useCallback, useRef, useState } from "react";
import { Action, Document, TemplateRegistry } from "../../types";
import { documentTemplates, inIframe, noop } from "../../utils";
import { DocumentRenderer } from "./DocumentRenderer";
import { DomListener } from "../common/DomListener";
import { isActionOf } from "typesafe-actions";
import { getLogger } from "../../logger";
import { renderDocument, selectTemplate } from "../frame/host.actions";
import { FrameActions, obfuscateField, updateHeight, updateTemplates } from "../frame/frame.actions";
import { HostConnector } from "../frame/HostConnector";

const { trace } = getLogger("FramedDocumentRenderer");

interface FramedDocumentRendererProps<D extends Document> {
  templateRegistry: TemplateRegistry<D>;
}
export function FramedDocumentRenderer<D extends Document>({
  templateRegistry
}: FramedDocumentRendererProps<D>): JSX.Element {
  const [document, setDocument] = useState<D>();
  const [templateName, setTemplateName] = useState<string>();
  const toHost = useRef<(actions: FrameActions) => void>(noop);
  const onConnected = useCallback(postMessage => {
    toHost.current = postMessage;
  }, []);

  // actions received by the parent hosting the component
  const dispatch = useCallback(
    async (action: Action): Promise<void> => {
      trace("in frame, received action", action.type);
      if (isActionOf(renderDocument, action)) {
        setDocument(action.payload as D);
        const templates = await documentTemplates(action.payload, templateRegistry).map(template => ({
          id: template.id,
          label: template.label
        }));
        // TODO remove cycle =)
        toHost.current(updateTemplates(templates));
      } else if (isActionOf(selectTemplate, action)) {
        setTemplateName(action.payload);
      } else {
        throw new Error("Add a logger please");
      }
    },
    [templateRegistry]
  );

  if (!inIframe()) {
    return <div>This component can&apos;t be renderer out of a frame</div>;
  }
  return (
    <DomListener onUpdate={height => toHost.current(updateHeight(height))}>
      <HostConnector dispatch={dispatch} onConnected={onConnected}>
        {document && (
          <DocumentRenderer
            document={document}
            templateName={templateName}
            handleObfuscation={field => toHost.current(obfuscateField(field))}
            templateRegistry={templateRegistry}
          />
        )}
      </HostConnector>
    </DomListener>
  );
}
