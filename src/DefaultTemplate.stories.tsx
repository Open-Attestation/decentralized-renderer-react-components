import type { Meta, StoryObj } from "@storybook/react";
import { DefaultTemplate } from "./DefaultTemplate";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof DefaultTemplate> = {
  title: "Template/Default Template",
  component: DefaultTemplate,
};

export default meta;
type Story = StoryObj<typeof DefaultTemplate>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  name: "Non-editable value",
  args: {
    title: "Default Template",
    description: <>This is the default template</>, // eslint-disable-line react/react-in-jsx-scope
    document: {
      foo: {
        title: "Bar is awesome",
        someVeryLongData:
          "JVBERi0xLjUNCiW1tbW1DQoxIDAgb2JqDQo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFIvTGFuZyhlbi1JTikgPj4NCmVuZG9iag0KMiAwIG9iag0KPDwvVHlwZS9QYWdlcy9Db3VudCAxNS9LaWRzWyAzIDAgUiAyMTkgMCBSIDM5MSAwIFIgNTIwIDAgUiA2MTAgMCBSIDY1OCAwIFIgNzU2IDAgUiA5MDYgMCBSIDEwMjIgMCBSIDExNjYgMCBSIDExNzYgMCBSIDEyODAgMCBSIDE0MTAgMCBSIDE1MjAgMCBSIDE3MzEgMCBSXSA",
      },
      name: "John Doe",
      institute: "Institute of John Doe",
      $template: {
        name: "custom",
        type: "EMBEDDED_RENDERER",
        url: "http://localhost:3000",
      },
    } as any,
  },
};
