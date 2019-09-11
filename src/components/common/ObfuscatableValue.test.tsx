import React from "react";
import { ObfuscatableValue } from "./ObfuscatableValue";
import { render, fireEvent } from "@testing-library/react";

describe("obfuscatablevalue component", () => {
  it("should display value only and not call onObfuscationRequested when editable is not set", () => {
    const callback = jest.fn();
    const { getByText, queryByTitle } = render(
      <ObfuscatableValue value="Text to display" onObfuscationRequested={callback} />
    );
    expect(getByText("Text to display")).toBeDefined();
    expect(queryByTitle("Obfuscate value")).toBeNull();
    fireEvent.click(getByText(/Text to display/i));
    expect(callback).toHaveBeenCalledTimes(0);
  });
  it("should display value only and not call onObfuscationRequested when editable is set to false", () => {
    const callback = jest.fn();
    const { getByText, queryByTitle } = render(
      <ObfuscatableValue value="Text to display" onObfuscationRequested={callback} editable={false} />
    );
    expect(getByText("Text to display")).toBeDefined();
    expect(queryByTitle("Obfuscate value")).toBeNull();
    fireEvent.click(getByText(/Text to display/i));
    expect(callback).toHaveBeenCalledTimes(0);
  });
  it("should display value/cross and call onObfuscationRequested when editable is set to true", () => {
    const callback = jest.fn();
    const { getByText, getByTitle } = render(
      <ObfuscatableValue value="Text to display" onObfuscationRequested={callback} editable />
    );
    expect(getByText("Text to display")).toBeDefined();
    expect(getByTitle("Obfuscate value")).toBeDefined();
    fireEvent.click(getByText(/Text to display/i));
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
