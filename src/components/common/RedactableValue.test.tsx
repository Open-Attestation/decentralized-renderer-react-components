import React from "react";
import { RedactableValue } from "./RedactableValue";
import { screen, render, fireEvent } from "@testing-library/react";

describe("redactablevalue component", () => {
  it("should display value only when editable is not set", () => {
    const callback = jest.fn();
    render(<RedactableValue value="Text to display" onRedactionRequested={callback} />);

    expect(screen.getByText("Text to display")).toBeInTheDocument();
    expect(screen.queryByTitle("Redact handler")).not.toBeInTheDocument();
  });

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
      <RedactableValue value="Text to display" onRedactionRequested={callback} editable iconRedact={<>foobar</>} />
    );

    expect(screen.getByText("Text to display")).toBeInTheDocument();
    expect(screen.queryByTitle("Redact handler")).toBeInTheDocument();
    expect(screen.queryByTitle("Redact default icon")).not.toBeInTheDocument();
    expect(screen.getByText("foobar")).toBeInTheDocument();
    fireEvent.click(screen.getByText("foobar"));
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
