import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ObfuscatableValue } from "./ObfuscatableValue";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof ObfuscatableValue> = {
  title: "Values/Obfuscatable Value",
  component: ObfuscatableValue,
};

export default meta;
type Story = StoryObj<typeof ObfuscatableValue>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const NonEditable: Story = {
  name: "Non-editable value",
  args: {
    value: "Some value",
  },
};

export const Editable: Story = {
  name: "Editable value",
  args: {
    value: "Some value",
    editable: true,
    onObfuscationRequested: action("Please obfuscate"),
  },
};
