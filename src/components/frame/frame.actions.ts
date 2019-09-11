// actions sent by frame to host
import { ActionType, createStandardAction } from "typesafe-actions";
import { Template } from "../../types";

export const updateHeight = createStandardAction("UPDATE_HEIGHT")<number>();
export const obfuscateField = createStandardAction("OBFUSCATE")<string>();
export const updateTemplates = createStandardAction("UPDATE_TEMPLATES")<Array<Pick<Template, "id" | "label">>>();
export type FrameActions = ActionType<typeof updateHeight | typeof obfuscateField | typeof updateTemplates>;
