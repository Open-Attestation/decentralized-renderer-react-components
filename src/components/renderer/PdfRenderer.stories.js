import { SAMPLE_PDF } from "./fixtures/pdf";
import { PdfRenderer } from "./PdfRenderer";
import React from "react";

export default {
  title: "PdfRenderer",
  component: PdfRenderer,
  argTypes: {
    attachment: {
      table: {
        disable: true,
      },
    },
  },
};

export const BasicExample = {
  args: {
    attachment: {
      data: SAMPLE_PDF,
    },
  },
  name: "basic example",
};
