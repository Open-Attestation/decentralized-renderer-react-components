import { DefaultTemplate } from "./DefaultTemplate";

export default {
  title: "DefaultTemplate",
  component: DefaultTemplate,
};

export const NonEditableValue = {
  args: {
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
    },
  },
};
