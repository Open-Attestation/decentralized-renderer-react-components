// actions sent by host to frame
import { ActionType, createStandardAction } from "typesafe-actions";
import { Document } from "../../types";
import { WrappedDocument } from "@govtechsg/open-attestation";

export const renderDocument = createStandardAction("RENDER_DOCUMENT")<{
  document: Document;
  rawDocument?: WrappedDocument<Document>;
}>();

export const selectTemplate = createStandardAction("SELECT_TEMPLATE")<string>();
export const getTemplates = createStandardAction("GET_TEMPLATES")<Document>();
export const print = createStandardAction("PRINT")();
export type HostActions = ActionType<
  typeof renderDocument | typeof selectTemplate | typeof getTemplates | typeof print
>;
export type HostActionsHandler = (action: HostActions) => void;

/**
 * @deprecated use HostActions
 */
export type LegacyHostActions = {
  renderDocument: (document: Document, rawDocument?: WrappedDocument<Document>) => void;
  selectTemplateTab: (tabIndex: number) => void;
  print: () => void;
};
