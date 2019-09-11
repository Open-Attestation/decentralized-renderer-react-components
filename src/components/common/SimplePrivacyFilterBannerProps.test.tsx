import React from "react";
import { SimplePrivacyFilterBanner } from "./SimplePrivacyFilterBanner";
import { render, fireEvent } from "@testing-library/react";

describe("simpleprivacyfilterbanner component", () => {
  it("should fire onToggleEditable when clicking on icon", () => {
    const callback = jest.fn();
    const { getByTitle } = render(<SimplePrivacyFilterBanner onToggleEditable={callback} />);
    fireEvent.click(getByTitle(/toggle certificate obfuscation/i));
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
