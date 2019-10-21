import React, { useCallback, useRef, useState } from "react";
import { Document, TemplateRegistry } from "../../types";
import { documentTemplates, inIframe, noop } from "../../utils";
import { DomListener } from "../common/DomListener";
import { LegacyHostConnector } from "../frame/HostConnector";

interface LegacyFramedDocumentRendererProps<D extends Document> {
  templateRegistry: TemplateRegistry<D>;
}

/**
 * @deprecated use FramedDocumentRenderer
 */
export function LegacyFramedDocumentRenderer<D extends Document>({
  templateRegistry
}: LegacyFramedDocumentRendererProps<D>): JSX.Element {
  const [document, setDocument] = useState<D>();
  const [templateIndex, setTemplateIndex] = useState(0);
  const toHost = useRef<any>(noop);
  const onConnected = useCallback(postMessage => {
    toHost.current = postMessage;
  }, []);

  const templates = document ? documentTemplates(document, templateRegistry) : [];
  const Template = templates[templateIndex] ? templates[templateIndex].template : null;
  if (!inIframe()) {
    return <div>This component can&apos;t be renderer out of a frame</div>;
  }
  return (
    <DomListener
      onUpdate={height => {
        console.log("fum");
        toHost.current.updateHeight(height);
      }}
    >
      <LegacyHostConnector
        methods={{
          renderDocument: async (doc: Document) => {
            setDocument(doc as D);
            const templates = await documentTemplates(doc, templateRegistry).map(template => ({
              id: template.id,
              label: template.label
            }));
            // TODO remove cycle =)
            toHost.current.updateTemplates(templates);
          },
          selectTemplateTab: (tabIndex: number) => {
            setTemplateIndex(tabIndex);
          }
        }}
        onConnected={onConnected}
      >
        {document && Template && (
          <div className="frameless-tabs" id="rendered-certificate">
            <Template document={document} handleObfuscation={field => toHost.current.handleObfuscation(field)} />
          </div>
        )}
      </LegacyHostConnector>
    </DomListener>
  );
}
