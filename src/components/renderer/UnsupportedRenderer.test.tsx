import React from "react";
import { render } from "@testing-library/react";
import { UnsupportedRenderer } from "./UnsupportedRenderer";

describe("component UnsupportedRenderer", () => {
  it("must display mime-type not supported", () => {
    const { getByText } = render(
      <UnsupportedRenderer attachment={{ type: "application/epub+zip", data: "", filename: "" }} />,
    );
    expect(getByText("Rendering of this type of attachment is not supported.")).toBeDefined();
    expect(getByText("Please check your mime-type: application/epub+zip")).toBeDefined();
  });
});
