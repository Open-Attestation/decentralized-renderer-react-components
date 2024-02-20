import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FrameConnector } from "./FrameConnector";
import { css } from "@emotion/react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof FrameConnector> = {
  title: "FrameConnector",
  component: FrameConnector,
  args: {
    source: "https://www.opencerts.io/",
    onConnected: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    dispatch: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  },
};

export default meta;
type Story = StoryObj<typeof FrameConnector>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const With_Style: Story = {
  name: "With Style",
  args: {
    style: { width: "100%", height: "200px", outline: "2px solid red" },
  },
};

export const With_Emotion: Story = {
  name: "With Emotion",
  render: (args) => (
    <FrameConnector
      {...args}
      css={css`
        width: 100%;
        height: 200px;
        outline: 2px solid blue;
      `}
    />
  ),
};

// const hi = () => <FrameConnector dispatch={() => {}} source="" onConnected={() => {}} css={css``} />;
