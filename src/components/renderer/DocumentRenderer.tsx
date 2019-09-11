import React, { FunctionComponent } from "react";
import { documentTemplates, noop } from "../../utils";
import { Document, TemplateRegistry } from "../../types";

interface DocumentViewerProps {
  templateRegistry: TemplateRegistry;
  document: Document;
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

export const DocumentRenderer: FunctionComponent<DocumentViewerProps> = ({
  templateRegistry,
  document,
  templateName,
  handleObfuscation = noop
}) => {
  const templates = documentTemplates(document, templateRegistry);
  const templateConfiguration = templates.find(template => template.id === templateName) || templates[0];
  const Template = templateConfiguration.template;
  return (
    <div className="frameless-tabs" id="rendered-certificate">
      <Template document={document} handleObfuscation={handleObfuscation} />
    </div>
  );
};
