import { DomListener } from "./DomListener";
import { Counter, NestedCounter } from "./Counter";
import React from "react";
import { action } from "@storybook/addon-actions";
import { CounterContext } from "./Counter";

export default {
  title: "DomListener",
  component: DomListener,
};

export const AsRootComponent = {
  name: "as a root component",
  args: {
    onUpdate: action("onUpdate"),
  },
  render: (args) => (
    <DomListener {...args}>
      <Counter />
    </DomListener>
  ),
};

export const AsANestedComponent = {
  render: () => (
    // state count is inside NestedCounter component
    <NestedCounter>
      <CounterContext.Consumer>
        {({ count, setCount }) => (
          // changing the count using setCount won't fire any events
          <DomListener onUpdate={action("onUpdate")}>
            <button onClick={() => setCount(count + 1)}>+</button>
          </DomListener>
        )}
      </CounterContext.Consumer>
    </NestedCounter>
  ),
  name: "as a nested component",
};
