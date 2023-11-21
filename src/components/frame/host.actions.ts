// actions sent by host to frame
import { ActionType, createAction } from "typesafe-actions";
import { OpenAttestationDocument, WrappedDocument } from "@tradetrust-tt/tradetrust";

export const renderDocument = createAction("RENDER_DOCUMENT")<{
  document: OpenAttestationDocument;
  rawDocument?: WrappedDocument<OpenAttestationDocument>;
}>();

export const selectTemplate = createAction("SELECT_TEMPLATE")<string>();
export const getTemplates = createAction("GET_TEMPLATES")<OpenAttestationDocument>();
export const print = createAction("PRINT")();
export type HostActions = ActionType<
  typeof renderDocument | typeof selectTemplate | typeof getTemplates | typeof print
>;
export type HostActionsHandler = (action: HostActions) => void;

/**
 * @deprecated use HostActions
 */
export type LegacyHostActions = {
  renderDocument: (document: OpenAttestationDocument, rawDocument?: WrappedDocument<OpenAttestationDocument>) => void;
  selectTemplateTab: (tabIndex: number) => void;
  print: () => void;
};
