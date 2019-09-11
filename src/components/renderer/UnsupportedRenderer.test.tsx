import React from "react";
import { render } from "@testing-library/react";
import { UnsupportedRenderer } from "./UnsupportedRenderer";

describe("component UnsupportedRenderer", () => {
  it("must display mime-type not supported", () => {
    const attachment = { type: "application/epub+zip" };
    const { getByText } = render(<UnsupportedRenderer attachment={attachment} />);
    expect(getByText("Rendering of this type of attachment is not supported.")).toBeDefined();
    expect(getByText("Please check your mime-type: application/epub+zip")).toBeDefined();
  });
});
