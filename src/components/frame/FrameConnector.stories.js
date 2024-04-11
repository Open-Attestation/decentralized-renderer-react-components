import { FrameConnector } from "./FrameConnector";
import { css } from "@emotion/core";
import React from "react";

export default {
  title: "FrameConnector",
  component: FrameConnector,
};

export const WithStyle = {
  args: {
    source: "https://opencerts.io",
    style: {
      width: "100%",
      height: "200px",
    },
  },
  name: "with style",
};

export const WithEmotion = {
  args: {
    source: "https://opencerts.io",
    css: css`
      width: 100%;
      height: 200px;
    `,
  },
  name: "with emotion",
};
