// actions sent by frame to host
import { ActionType, createStandardAction } from "typesafe-actions";

export const updateHeight = createStandardAction("UPDATE_HEIGHT")<number>();
export const obfuscateField = createStandardAction("OBFUSCATE")<string>();
export const updateTemplates = createStandardAction("UPDATE_TEMPLATES")<
  Array<{ id: string; label: string; type: string }>
>();
export type FrameActions = ActionType<typeof updateHeight | typeof obfuscateField | typeof updateTemplates>;
export type FrameActionsHandler = (action: FrameActions) => void;

/**
 * @deprecated use FrameActions
 */
export type LegacyFrameActions = {
  updateHeight: (height: number) => void;
  updateTemplates: (templates: Array<{ id: string; label: string; type: string }>) => void;
  handleObfuscation: (field: string) => void;
};
