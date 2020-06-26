import React, { useCallback, useRef, useState } from "react";
import { Attachment, Document, TemplateRegistry } from "../../types";
import { documentTemplates, noop } from "../../utils";
import { isActionOf } from "typesafe-actions";
import { getLogger } from "../../logger";
import { getTemplates, HostActions, renderDocument, selectTemplate, print } from "../frame/host.actions";
import { FrameActions, obfuscateField, updateHeight, updateTemplates } from "../frame/frame.actions";
import { HostConnector } from "../frame/HostConnector";
import { DomListener } from "../common/DomListener";
import { noAttachmentRenderer } from "./NoAttachmentRenderer";
import { WrappedDocument } from "@govtechsg/open-attestation";

const { trace } = getLogger("FramedDocumentRenderer");

interface FramedDocumentRendererProps<D extends Document> {
  templateRegistry: TemplateRegistry<D>;
  attachmentToComponent?: (attachment: Attachment, document: Document) => React.FunctionComponent;
}
export function FramedDocumentRenderer<D extends Document>({
  templateRegistry,
  attachmentToComponent = noAttachmentRenderer
}: FramedDocumentRendererProps<D>): JSX.Element {
  const [document, setDocument] = useState<D>();
  // used only to handle legacy setSelectTemplate function
  // dispatch function (below) is connected once through the frame and the reference to this function never change is
  // host and iframe. We need to use a reference to allow object mutation
  const documentForLegacyUsage = useRef<D>();
  const [rawDocument, setRawDocument] = useState<WrappedDocument<D>>();
  const [templateName, setTemplateName] = useState<string>();
  const toHost = useRef<(actions: FrameActions) => void>(noop);

  const templates = document ? documentTemplates(document, templateRegistry, attachmentToComponent) : [];
  const templateConfiguration = templates.find(template => template.id === templateName) || templates[0] || {};
  const Template = templateConfiguration.template;

  const onConnected = useCallback(postMessage => {
    toHost.current = postMessage;
  }, []);

  // actions received by the parent hosting the component
  const dispatch = useCallback(
    (action: HostActions): any => {
      trace("in frame, received action", action.type);
      if (isActionOf(renderDocument, action)) {
        setDocument(action.payload.document as D);
        documentForLegacyUsage.current = action.payload.document as D;
        if (action.payload.rawDocument) {
          setRawDocument(action.payload.rawDocument as WrappedDocument<D>);
        }

        const run = async (): Promise<void> => {
          const templates = await documentTemplates(
            action.payload.document,
            templateRegistry,
            attachmentToComponent
          ).map(template => ({
            id: template.id,
            label: template.label,
            type: template.type
          }));
          toHost.current(updateTemplates(templates));
        };
        run();
      } else if (isActionOf(selectTemplate, action)) {
        if (typeof action.payload === "number") {
          const templates = documentTemplates(
            documentForLegacyUsage.current as Document,
            templateRegistry,
            attachmentToComponent
          );
          setTemplateName(templates[action.payload].id);
        } else {
          setTemplateName(action.payload);
        }
      } else if (isActionOf(getTemplates, action)) {
        const templates = documentTemplates(action.payload, templateRegistry, attachmentToComponent).map(template => ({
          id: template.id,
          label: template.label,
          type: template.type
        }));
        toHost.current(updateTemplates(templates)); // send the result to the iframe
        return templates; // react-native expect to get the result directly
      } else if (isActionOf(print, action)) {
        window.print();
      } else {
        throw new Error(`Action ${JSON.stringify(action)} is not handled`);
      }
    },
    [templateRegistry, attachmentToComponent]
  );
  window.openAttestation = dispatch; // expose different actions for direct injection

  return (
    <DomListener onUpdate={height => toHost.current(updateHeight(height))}>
      <HostConnector dispatch={dispatch} onConnected={onConnected}>
        {document && Template && (
          <div className="frameless-tabs" id="rendered-certificate">
            <Template
              document={document}
              wrappedDocument={rawDocument}
              handleObfuscation={field => toHost.current(obfuscateField(field))}
            />
          </div>
        )}
      </HostConnector>
    </DomListener>
  );
}
