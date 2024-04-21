/* eslint-disable jest/prefer-spy-on */
// Disable the spyOn check due to known issues with mocking fetch in jsDom env
// https://stackoverflow.com/questions/74945569/cannot-access-built-in-node-js-fetch-function-from-jest-tests
import { render } from "@testing-library/react";
import { DisplayResult, SvgRenderer } from "./SvgRenderer";
import fs from "fs";
import { Blob } from "buffer";
import React from "react";
import {
  v4WithSvgUrlAndDigestMultibase,
  v4WithEmbeddedSvgAndDigestMultibase,
  v4WithTamperedEmbeddedSvgAndDigestMultibase,
  v2WithSvgUrlAndDigestMultibase,
  v4WithOnlyTamperedEmbeddedSvg,
  v4WithNoRenderMethod,
} from "./fixtures/svgRendererSamples";
import { __unsafe__not__for__production__v2__SvgRenderer } from "./SvgV2Adapter";

describe("svgRenderer component", () => {
  const mockSvg = fs.readFileSync("./src/components/renderer/fixtures/example_cert.svg");
  const mockSvgBlob = new Blob([mockSvg], { type: "image/svg+xml" });
  const mockResponse = { ok: true, blob: () => Promise.resolve(mockSvgBlob) };

  it("should render v4 doc correctly with a valid SVG URL", async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    const svgRef = React.createRef<HTMLImageElement>();

    const { findByTitle } = render(<SvgRenderer document={v4WithSvgUrlAndDigestMultibase} ref={svgRef} />);

    const image = (await findByTitle("Svg Renderer Image")) as HTMLImageElement;
    const imageSrc = image.src;
    const imageAlt = image.alt;

    expect(imageAlt).toContain("Svg image of the verified document");
    expect(imageSrc).toContain(encodeURIComponent("CERTIFICATE OF COMPLETION"));
    expect(imageSrc).toContain(encodeURIComponent("TAN CHEN CHEN"));
  });

  it("should render v4 doc correctly with a valid embedded SVG", async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    const svgRef = React.createRef<HTMLImageElement>();

    const { findByTitle } = render(<SvgRenderer document={v4WithEmbeddedSvgAndDigestMultibase} ref={svgRef} />);

    const image = (await findByTitle("Svg Renderer Image")) as HTMLImageElement;
    const imageSrc = image.src;
    const imageAlt = image.alt;

    expect(imageAlt).toContain("Svg image of the verified document");
    expect(imageSrc).toContain(encodeURIComponent("CERTIFICATE OF COMPLETION"));
    expect(imageSrc).toContain(encodeURIComponent("TAN CHEN CHEN"));
  });

  it("should render v2 doc correctly with a valid SVG URL", async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    const svgRef = React.createRef<HTMLImageElement>();

    const { findByTitle } = render(
      <__unsafe__not__for__production__v2__SvgRenderer document={v2WithSvgUrlAndDigestMultibase} ref={svgRef} />
    );

    const image = (await findByTitle("Svg Renderer Image")) as HTMLImageElement;
    const imageSrc = image.src;
    const imageAlt = image.alt;

    expect(imageAlt).toContain("Svg image of the verified document");
    expect(imageSrc).toContain(encodeURIComponent("CERTIFICATE OF COMPLETION"));
    expect(imageSrc).toContain(encodeURIComponent("TAN CHEN CHEN"));
  });

  const tamperedSvgBuffer = Buffer.concat([mockSvg, Buffer.from([0x12, 0x34])]); // Add some random bytes to tamper svg
  const tamperedSvgBlob = new Blob([tamperedSvgBuffer], { type: "image/svg+xml" });
  const tamperedMockResponse = { ok: true, blob: () => Promise.resolve(tamperedSvgBlob) };

  it("should render v4 doc with embedded SVG with digestMultibase", async () => {
    // If SVG is embedded, digestMultibase will be ignored
    global.fetch = jest.fn().mockResolvedValue(tamperedMockResponse);
    const svgRef = React.createRef<HTMLImageElement>();

    const { findByTitle } = render(<SvgRenderer document={v4WithTamperedEmbeddedSvgAndDigestMultibase} ref={svgRef} />);

    const image = (await findByTitle("Svg Renderer Image")) as HTMLImageElement;
    const imageSrc = image.src;
    const imageAlt = image.alt;

    expect(imageAlt).toContain("Svg image of the verified document");
    expect(imageSrc).toContain(encodeURIComponent("CERTIFICATE OF COMPLETION"));
    expect(imageSrc).toContain(encodeURIComponent("TAN CHEN CHEN"));
  });

  it("should render v4 doc with modified SVG when no digestMultibase", async () => {
    global.fetch = jest.fn().mockResolvedValue(tamperedMockResponse);
    const svgRef = React.createRef<HTMLImageElement>();

    const { findByTitle } = render(<SvgRenderer document={v4WithOnlyTamperedEmbeddedSvg} ref={svgRef} />);
    const image = (await findByTitle("Svg Renderer Image")) as HTMLImageElement;
    const imageSrc = image.src;
    const imageAlt = image.alt;

    expect(imageAlt).toContain("Svg image of the verified document");
    expect(imageSrc).toContain(encodeURIComponent("TAMPERED CERTIFICATE OF COMPLETION"));
    expect(imageSrc).toContain(encodeURIComponent("TAN CHEN CHEN"));
  });

  it("should render SvgModifiedTemplate when SVG at URL has been tampered with", async () => {
    global.fetch = jest.fn().mockResolvedValue(tamperedMockResponse);
    const svgRef = React.createRef<HTMLImageElement>();
    const mockHandleResult = jest.fn();

    const { findByTestId } = render(
      <SvgRenderer document={v4WithSvgUrlAndDigestMultibase} ref={svgRef} onResult={mockHandleResult} />
    );

    const defaultTemplate = await findByTestId("default-template");
    expect(defaultTemplate.textContent).toContain("The remote content for this document has been modified");
    expect(defaultTemplate.textContent).toContain(`URL: “http://mockbucket.com/static/svg_test.svg”`);
    expect(mockHandleResult).toHaveBeenCalledWith(DisplayResult.DIGEST_ERROR, undefined);
  });

  it("should render default template when document.RenderMethod is undefined", async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    const svgRef = React.createRef<HTMLImageElement>();

    const { findByTestId } = render(<SvgRenderer document={v4WithNoRenderMethod} ref={svgRef} />);

    const defaultTemplate = await findByTestId("default-template");
    expect(defaultTemplate.textContent).toContain("The contents of this document have not been formatted");
    expect(defaultTemplate.textContent).toContain("identifier: example.openattestation.com");
  });

  const badMockResponse = { ok: false };
  it("should render connection error template when SVG cannot be fetched", async () => {
    global.fetch = jest.fn().mockResolvedValue(badMockResponse);
    const svgRef = React.createRef<HTMLImageElement>();
    const mockHandleResult = jest.fn();

    const { findByTestId } = render(
      <SvgRenderer document={v4WithSvgUrlAndDigestMultibase} ref={svgRef} onResult={mockHandleResult} />
    );

    const defaultTemplate = await findByTestId("default-template");
    expect(defaultTemplate.textContent).toContain("This document might be having loading issues");
    expect(defaultTemplate.textContent).toContain(`URL: “http://mockbucket.com/static/svg_test.svg”`);
    expect(mockHandleResult).toHaveBeenCalledWith(
      DisplayResult.CONNECTION_ERROR,
      new Error("Failed to fetch remote SVG")
    );
  });
});
/* eslint-enable jest/prefer-spy-on */
