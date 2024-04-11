import { ObfuscatableValue } from "./ObfuscatableValue";
import { action } from "@storybook/addon-actions";
import React from "react";
export default {
  title: "ObfuscatableValue",
  component: ObfuscatableValue,
};

export const NonEditableValue = {
  args: {
    value: "Some value",
  },
  name: "non-editable value",
};

export const EditableValue = {
  args: {
    value: "Some value",
    editable: true,
    onObfuscationRequested: action("Please obfuscate"),
  },
  name: "editable value",
};
