import React, { useRef, useState } from "react";
import { TheRenderer, ConnectedResults } from "../../src";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

type Document = {
  name: string;
  document: any;
  frameSource: string;
};
interface AppProps {
  documents: Document[];
}
interface ViewerProps {
  document: Document;
}

const TemplatesContainer = styled.div``;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  button {
    color: #fff;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-weight: 700;
    border-radius: 0.25rem;
    background-color: #4299e1;
    cursor: pointer;
    border: 0;
  }
  button:hover {
    background-color: #2b6cb0;
  }
`;

const DocumentsContainer = styled.div`
  width: 300px;
  padding: 0.5rem;

  .document {
    cursor: pointer;
    padding: 0.5rem;
    background-color: #ebf8ff;
    border-top: 4px solid #4299e2;
    margin-bottom: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .document.active {
    border-top-color: #38b2ac;
    background-color: #e6fffa;
  }
`;

const Viewer: React.FunctionComponent<ViewerProps> = ({ document }): React.ReactElement => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [rendererResults, setRendererResults] = useState<ConnectedResults>();

  const documentRef = useRef(document);
  if (documentRef.current !== document) {
    documentRef.current = document;
    setSelectedTemplate("");
    setRendererResults(undefined);
  }

  return (
    <div
      css={css`
        flex: 1 0 auto;
      `}
    >
      {rendererResults && (
        <ActionsContainer>
          <button
            onClick={() => {
              rendererResults.print();
            }}
          >
            Print
          </button>
          {rendererResults.type === "EMBEDDED_RENDERER" && (
            <button
              onClick={() => {
                rendererResults.download(document.name + ".oa");
              }}
            >
              Download
            </button>
          )}
        </ActionsContainer>
      )}
      <div>
        {!document && (
          <div
            css={css`
              text-align: center;
              flex-grow: 1;
              align-self: center;
              cursor: pointer;
            `}
          >
            Please select a document on the left bar
          </div>
        )}
        <div
          css={css`
            width: 100%;
            display: ${document ? "block" : "none"};
          `}
        >
          {rendererResults?.type === "EMBEDDED_RENDERER" && (
            <TemplatesContainer>
              <ul
                css={css`
                  display: flex;
                  border-bottom: 1px solid #e2e8f0;
                  list-style: none;
                  margin: 0;
                  padding: 0;
                  li {
                    margin-right: 0.25rem;
                  }
                  li.selected {
                    margin-bottom: -1px;
                  }
                  a {
                    text-decoration: none;
                    padding-left: 1rem;
                    padding-right: 1rem;
                    padding-top: 0.5rem;
                    padding-bottom: 0.5rem;
                    font-weight: 600;
                    display: inline-block;
                    background-color: white;
                    border-style: solid;
                    border-color: #e2e8f0;
                  }
                  li.selected a {
                    color: #2b6cb0;
                    border-bottom: none;
                    border-left-width: 1px;
                    border-right-width: 1px;
                    border-top-width: 1px;
                    border-top-left-radius: 0.25rem;
                    border-top-right-radius: 0.25rem;
                  }

                  li a {
                    color: #4299e1;
                    border-width: 0px;
                  }
                `}
              >
                {rendererResults.templates.map((template) => (
                  <li
                    key={template.id}
                    className={`tab ${selectedTemplate === template.id ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      rendererResults.selectTemplate({
                        id: template.id,
                      });
                    }}
                  >
                    <a href="#">{template.label}</a>
                  </li>
                ))}
              </ul>
            </TemplatesContainer>
          )}
          <div
            css={css`
              border: 1px solid #e2e8f0;
              border-top: none;
              padding: 2rem;
              margin-right: 0.5rem;
            `}
          >
            <TheRenderer
              document={document.document}
              onConnected={(results) => {
                console.log(results);
                setRendererResults(results);
                if (results.type === "EMBEDDED_RENDERER") {
                  setSelectedTemplate(results.selectedTemplateId);
                }
              }}
              onError={({ type, ...rest }) => {
                console.error(type);
                console.error(rest);
              }}
              onObfuscation={({ updatedDocument, field }) => {
                console.log(updatedDocument);
                console.log(field);
              }}
              loadingComponent={<>loading...</>}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppContainer: React.FunctionComponent<AppProps> = ({ documents }): React.ReactElement => {
  const [document, setDocument] = useState<Document>();

  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <DocumentsContainer>
        <h4>Documents</h4>
        {documents.length === 0 && <div>Please configure the application and provide at least one document</div>}
        {documents.map((d, index) => {
          return (
            <div key={index} className={`document ${document === d ? "active" : ""}`} onClick={() => setDocument(d)}>
              {d.name}
            </div>
          );
        })}
      </DocumentsContainer>
      {document && <Viewer key={document.frameSource} document={document} />}
    </div>
  );
};
