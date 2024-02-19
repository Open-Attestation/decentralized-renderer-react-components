import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SAMPLE_PDF } from "./fixtures/pdf";
import { PdfRenderer } from "./PdfRenderer";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof PdfRenderer> = {
  title: "Renderer/Pdf Renderer",
  component: PdfRenderer,
};

export default meta;
type Story = StoryObj<typeof PdfRenderer>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const PDF: Story = {
  name: "Basic Example",
  args: {
    attachment: { fileName: "sample.pdf", mimeType: "application/pdf", data: SAMPLE_PDF },
  },
};
