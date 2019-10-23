import React from "react";
import { documentTemplates, noop } from "../../utils";
import { Document, SignedDocument, TemplateRegistry } from "../../types";

interface DocumentViewerProps<D extends Document> {
  templateRegistry: TemplateRegistry<D>;
  document: D;
  rawDocument?: SignedDocument<D>;
  templateName?: string;
  handleObfuscation?: (field: string) => void;
}

// TODO list
// test frame
// fix style of templates
// documentation
// tests..
// errors...
// https://www.html5rocks.com/en/tutorials/security/sandboxed-iframes-

export function DocumentRenderer<D extends Document>({
  templateRegistry,
  document,
  rawDocument,
  templateName,
  handleObfuscation = noop
}: DocumentViewerProps<D>): JSX.Element {
  const templates = documentTemplates(document, templateRegistry);
  const templateConfiguration = templates.find(template => template.id === templateName) || templates[0];
  const Template = templateConfiguration.template;
  return (
    <div className="frameless-tabs" id="rendered-certificate">
      <Template document={document} handleObfuscation={handleObfuscation} rawDocument={rawDocument} />
    </div>
  );
}
