// actions sent by frame to host
import { ActionType, createStandardAction } from "typesafe-actions";

export const updateHeight = createStandardAction("UPDATE_HEIGHT")<number>();
export const obfuscateField = createStandardAction("OBFUSCATE")<string>();
export const updateTemplates = createStandardAction("UPDATE_TEMPLATES")<Array<{ id: string; label: string }>>();
export type FrameActions = ActionType<typeof updateHeight | typeof obfuscateField | typeof updateTemplates>;
