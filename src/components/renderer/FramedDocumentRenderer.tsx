import React, { useCallback, useRef, useState } from "react";
import { Document, SignedDocument, TemplateRegistry } from "../../types";
import { documentTemplates, inIframe, noop } from "../../utils";
import { DomListener } from "../common/DomListener";
import { isActionOf } from "typesafe-actions";
import { getLogger } from "../../logger";
import { HostActions, renderDocument, selectTemplate } from "../frame/host.actions";
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
  // used only to handle legacy setSelectTemplate function
  // dispatch function (below) is connected once through the frame and the reference to this function never change is
  // host and iframe. We need to use a reference to allow object mutation
  const documentForLegacyUsage = useRef<D>();
  const [rawDocument, setRawDocument] = useState<SignedDocument<D>>();
  const [templateName, setTemplateName] = useState<string>();
  const toHost = useRef<(actions: FrameActions) => void>(noop);

  const templates = document ? documentTemplates(document, templateRegistry) : [];
  const templateConfiguration = templates.find(template => template.id === templateName) || templates[0] || {};
  const Template = templateConfiguration.template;

  const onConnected = useCallback(postMessage => {
    toHost.current = postMessage;
  }, []);

  // actions received by the parent hosting the component
  const dispatch = useCallback(
    async (action: HostActions): Promise<void> => {
      trace("in frame, received action", action.type);
      if (isActionOf(renderDocument, action)) {
        setDocument(action.payload.document as D);
        documentForLegacyUsage.current = action.payload.document as D;
        if (action.payload.rawDocument) {
          setRawDocument(action.payload.rawDocument as SignedDocument<D>);
        }
        const templates = await documentTemplates(action.payload.document, templateRegistry).map(template => ({
          id: template.id,
          label: template.label
        }));
        // TODO remove cycle =)
        toHost.current(updateTemplates(templates));
      } else if (isActionOf(selectTemplate, action)) {
        if (typeof action.payload === "number") {
          const templates = documentTemplates(documentForLegacyUsage.current as Document, templateRegistry);
          setTemplateName(templates[action.payload].id);
        } else {
          setTemplateName(action.payload);
        }
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
        {document && Template && (
          <div className="frameless-tabs" id="rendered-certificate">
            <Template
              document={document}
              rawDocument={rawDocument}
              handleObfuscation={field => toHost.current(obfuscateField(field))}
            />
          </div>
        )}
      </HostConnector>
    </DomListener>
  );
}
