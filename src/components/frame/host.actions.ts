// actions sent by host to frame
import { ActionType, createStandardAction } from "typesafe-actions";
import { Document, SignedDocument } from "../../types";

export const renderDocument = createStandardAction("RENDER_DOCUMENT")<{
  document: Document;
  rawDocument?: SignedDocument<Document>;
}>();
export const selectTemplate = createStandardAction("SELECT_TEMPLATE")<string>();
export type HostActions = ActionType<typeof renderDocument | typeof selectTemplate>;
