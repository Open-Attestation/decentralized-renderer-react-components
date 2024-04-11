import React from "react";
import { DEFAULT_NO_VALUE_MSG, DEFAULT_REDACTED_MSG, RedactableValue } from "./RedactableValue";
import { screen, render, fireEvent } from "@testing-library/react";

describe("redactablevalue component", () => {
  it("should display value only when editable is set to false", () => {
    const callback = jest.fn();
    render(<RedactableValue value="Text to display" onRedactionRequested={callback} editable={false} />);

    expect(screen.getByText("Text to display")).toBeInTheDocument();
    expect(screen.queryByTitle("Redact handler")).not.toBeInTheDocument();
  });

  it("should display value, redact default icon and call onRedactionRequested when editable is set to true", () => {
    const callback = jest.fn();
    render(<RedactableValue value="Text to display" onRedactionRequested={callback} editable />);

    expect(screen.getByText("Text to display")).toBeInTheDocument();
    expect(screen.queryByTitle("Redact handler")).toBeInTheDocument();
    expect(screen.queryByTitle("Redact default icon")).toBeInTheDocument();
    fireEvent.click(screen.getByTitle("Redact handler"));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should display value, custom icon redact and call onRedactionRequested when editable is set to true", () => {
    const callback = jest.fn();
    render(
      <RedactableValue value="Text to display" onRedactionRequested={callback} editable iconRedact={<>foobar</>} />,
    );

    expect(screen.getByText("Text to display")).toBeInTheDocument();
    expect(screen.queryByTitle("Redact handler")).toBeInTheDocument();
    expect(screen.queryByTitle("Redact default icon")).not.toBeInTheDocument();
    expect(screen.getByText("foobar")).toBeInTheDocument();
    fireEvent.click(screen.getByText("foobar"));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should display default redacted message when no redacted message is specified", () => {
    const callback = jest.fn();
    render(
      <RedactableValue value="Text to display" onRedactionRequested={callback} editable iconRedact={<>foobar</>} />,
    );

    fireEvent.click(screen.getByText("foobar"));
    expect(screen.getByText(DEFAULT_REDACTED_MSG)).toBeInTheDocument();
  });

  it("should display custom redacted message when redacted message is provided", () => {
    const callback = jest.fn();
    const CUSTOM_REDACTED_MSG = "custom redacted message";
    render(
      <RedactableValue
        value="Text to display"
        onRedactionRequested={callback}
        editable
        iconRedact={<>foobar</>}
        redactedMessage={CUSTOM_REDACTED_MSG}
      />,
    );

    fireEvent.click(screen.getByText("foobar"));
    expect(screen.getByText(CUSTOM_REDACTED_MSG)).toBeInTheDocument();
  });

  it("should display default no value message when no custom message is specified", () => {
    const callback = jest.fn();
    render(<RedactableValue value={undefined} onRedactionRequested={callback} editable iconRedact={<>foobar</>} />);

    expect(screen.getByText(DEFAULT_NO_VALUE_MSG)).toBeInTheDocument();
  });

  it("should display custom no value message when provided", () => {
    const callback = jest.fn();
    const CUSTOM_NO_VALUE_MSG = "custom no value message";
    render(
      <RedactableValue
        value={undefined}
        onRedactionRequested={callback}
        editable
        iconRedact={<>foobar</>}
        noValueMessage={CUSTOM_NO_VALUE_MSG}
      />,
    );

    expect(screen.getByText(CUSTOM_NO_VALUE_MSG)).toBeInTheDocument();
  });

  it("should hide value when isValueHidden", () => {
    const callback = jest.fn();
    render(<RedactableValue value={`foo`} isValueHidden onRedactionRequested={callback} editable />);
    expect(screen.queryByTestId("redactable-value")).not.toBeInTheDocument();
  });

  it("should show redact handler when value exists", () => {
    const callback = jest.fn();
    render(<RedactableValue value={`foo`} onRedactionRequested={callback} editable />);
    expect(screen.queryByTitle("Redact handler")).toBeInTheDocument();
  });

  it("should not show redact handler when value does not exists (obfuscated)", () => {
    const callback = jest.fn();
    render(<RedactableValue onRedactionRequested={callback} editable />);
    expect(screen.queryByTitle("Redact handler")).not.toBeInTheDocument();
  });
});
