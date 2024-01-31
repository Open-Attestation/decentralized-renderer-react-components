import React from "react";
import { JsonView } from "./JsonView";
import { render } from "@testing-library/react";

describe("jsonView component", () => {
  it("should display json view of a json object with nested elements", () => {
    const screen = render(
      <JsonView
        src={{
          string: "test",
          number: 1,
          boolean: false,
          person: { name: "john doe", age: 35, isMarried: false },
          nestedObj: { anotherLayerOfNesting: { person2: { name: "jane doe", age: 20, isMarried: true } } },
          arrayOfObj: [
            { three: "three", four: "four" },
            { five: "five", six: "six" },
          ],
          arrayOfArr: [
            ["test3", "test4"],
            ["test5", "test6"],
          ],
          aVeryLongString:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          aVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLongKeyName:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          aVeryNestedObj: {
            nest1: {
              nest2: { nest3: { nest4: { nest5: { nest6: { nest7: { nest8: { nest9: { nest10: "test" } } } } } } } },
            },
          },
        }}
      />
    );

    expect(screen.getByTestId("json-view")).toMatchSnapshot();
  });
});
