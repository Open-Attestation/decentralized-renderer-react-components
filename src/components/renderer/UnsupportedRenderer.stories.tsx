import type { Meta, StoryObj } from "@storybook/react";
import { UnsupportedRenderer } from "./UnsupportedRenderer";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof UnsupportedRenderer> = {
  title: "Renderer/Unsupported Renderer",
  component: UnsupportedRenderer,
};

export default meta;
type Story = StoryObj<typeof UnsupportedRenderer>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Unsupported: Story = {
  name: "Basic Example",
  args: {
    attachment: { fileName: "unknown.xyz", mimeType: "text/xyz", data: "xyz" },
  },
};
