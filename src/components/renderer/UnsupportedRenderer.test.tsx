import React from "react";
import { render } from "@testing-library/react";
import { UnsupportedRenderer } from "./UnsupportedRenderer";

describe("component UnsupportedRenderer", () => {
  it("must display mime-type not supported", () => {
    const attachment = { type: "application/epub+zip" };
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore this attachment is not handled by the lib
    const { getByText } = render(<UnsupportedRenderer attachment={attachment} />);
    expect(getByText("Rendering of this type of attachment is not supported.")).toBeDefined();
    expect(getByText("Please check your mime-type: application/epub+zip")).toBeDefined();
  });
});
