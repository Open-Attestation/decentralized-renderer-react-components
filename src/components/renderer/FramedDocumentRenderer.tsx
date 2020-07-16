import React, { useCallback, useRef, useState } from "react";
import { Attachment, Document, TemplateRegistry } from "../../types";
import { documentTemplates, noop } from "../../utils";
import { getLogger } from "../../logger";
import { HostActions } from "../frame/host.actions";
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
      if (action.type === "RENDER_DOCUMENT") {
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
      } else if (action.type === "SELECT_TEMPLATE") {
        setTemplateName(action.payload);
      } else if (action.type === "GET_TEMPLATES") {
        const templates = documentTemplates(action.payload, templateRegistry, attachmentToComponent).map(template => ({
          id: template.id,
          label: template.label,
          type: template.type
        }));
        toHost.current(updateTemplates(templates)); // send the result to the iframe
        return templates; // react-native expect to get the result directly
      } else if (action.type === "PRINT") {
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
