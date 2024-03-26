/* eslint-disable jest/prefer-spy-on */
// Disable the spyOn check due to known issues with mocking fetch in jsDom env
// https://stackoverflow.com/questions/74945569/cannot-access-built-in-node-js-fetch-function-from-jest-tests
import { render } from "@testing-library/react";
import { SvgRenderer } from "./SvgRenderer";
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

describe("svgRenderer component", () => {
  const mockSvg = fs.readFileSync("./src/components/renderer/fixtures/example_cert.svg");
  const mockSvgBlob = new Blob([mockSvg], { type: "image/svg+xml" });
  const mockResponse = { ok: true, blob: () => Promise.resolve(mockSvgBlob) };

  it("should render v4 doc correctly with a valid SVG URL", async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    const svgRef = React.createRef<HTMLIFrameElement>();

    const { findByTitle } = render(<SvgRenderer document={v4WithSvgUrlAndDigestMultibase} svgRef={svgRef} />);

    const iFrame = await findByTitle("Svg Renderer Frame");
    const srcdocContent = (iFrame as HTMLIFrameElement).srcdoc;

    expect(srcdocContent).toContain("SVG document image");
    expect(srcdocContent).toContain(encodeURIComponent("CERTIFICATE OF COMPLETION"));
    expect(srcdocContent).toContain(encodeURIComponent("TAN CHEN CHEN"));
  });

  it("should render v4 doc correctly with a valid embedded SVG", async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    const svgRef = React.createRef<HTMLIFrameElement>();

    const { findByTitle } = render(<SvgRenderer document={v4WithEmbeddedSvgAndDigestMultibase} svgRef={svgRef} />);

    const iFrame = await findByTitle("Svg Renderer Frame");
    const srcdocContent = (iFrame as HTMLIFrameElement).srcdoc;

    expect(srcdocContent).toContain("SVG document image");
    expect(srcdocContent).toContain(encodeURIComponent("CERTIFICATE OF COMPLETION"));
    expect(srcdocContent).toContain(encodeURIComponent("TAN CHEN CHEN"));
  });

  it("should render v2 doc correctly with a valid SVG URL", async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    const svgRef = React.createRef<HTMLIFrameElement>();

    const { findByTitle } = render(
      <SvgRenderer document={v2WithSvgUrlAndDigestMultibase} svgRef={svgRef} forceV2={true} />
    );

    const iFrame = await findByTitle("Svg Renderer Frame");
    const srcdocContent = (iFrame as HTMLIFrameElement).srcdoc;

    expect(srcdocContent).toContain("SVG document image");
    expect(srcdocContent).toContain(encodeURIComponent("CERTIFICATE OF COMPLETION"));
    expect(srcdocContent).toContain(encodeURIComponent("TAN CHEN CHEN"));
  });

  const tamperedSvgBuffer = Buffer.concat([mockSvg, Buffer.from([0x12, 0x34])]); // Add some random bytes to tamper svg
  const tamperedSvgBlob = new Blob([tamperedSvgBuffer], { type: "image/svg+xml" });
  const tamperedMockResponse = { ok: true, blob: () => Promise.resolve(tamperedSvgBlob) };

  it("should render v4 doc with embedded SVG with digestMultibase", async () => {
    // If SVG is embedded, digestMultibase will be ignored
    global.fetch = jest.fn().mockResolvedValue(tamperedMockResponse);
    const svgRef = React.createRef<HTMLIFrameElement>();

    const { findByTitle } = render(
      <SvgRenderer document={v4WithTamperedEmbeddedSvgAndDigestMultibase} svgRef={svgRef} />
    );

    const iFrame = await findByTitle("Svg Renderer Frame");
    const srcdocContent = (iFrame as HTMLIFrameElement).srcdoc;

    expect(srcdocContent).toContain("SVG document image");
    expect(srcdocContent).toContain(encodeURIComponent("CERTIFICATE OF COMPLETION"));
    expect(srcdocContent).toContain(encodeURIComponent("TAN CHEN CHEN"));
  });

  it("should render v4 doc with modified SVG when no digestMultibase", async () => {
    global.fetch = jest.fn().mockResolvedValue(tamperedMockResponse);
    const svgRef = React.createRef<HTMLIFrameElement>();
    const svgUrl = v4WithOnlyTamperedEmbeddedSvg.renderMethod.id;

    const { findByTitle } = render(
      <SvgRenderer svgData={svgUrl} document={v4WithOnlyTamperedEmbeddedSvg} svgRef={svgRef} />
    );

    const iFrame = await findByTitle("Svg Renderer Frame");
    const srcdocContent = (iFrame as HTMLIFrameElement).srcdoc;

    expect(srcdocContent).toContain("SVG document image");
    expect(srcdocContent).toContain(encodeURIComponent("TAMPERED CERTIFICATE OF COMPLETION"));
    expect(srcdocContent).toContain(encodeURIComponent("TAN CHEN CHEN"));
  });

  it("should render SvgModifiedTemplate when SVG at URL has been tampered with", async () => {
    global.fetch = jest.fn().mockResolvedValue(tamperedMockResponse);
    const svgRef = React.createRef<HTMLIFrameElement>();

    const { findByTestId } = render(<SvgRenderer document={v4WithSvgUrlAndDigestMultibase} svgRef={svgRef} />);

    const defaultTemplate = await findByTestId("default-template");
    expect(defaultTemplate.textContent).toContain("The remote content for this document has been modified");
    expect(defaultTemplate.textContent).toContain(`URL: “http://mockbucket.com/static/svg_test.svg”`);
  });

  it("should render default template when document.RenderMethod is undefined", async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse);
    const svgRef = React.createRef<HTMLIFrameElement>();

    const { findByTestId } = render(<SvgRenderer document={v4WithNoRenderMethod} svgRef={svgRef} />);

    const defaultTemplate = await findByTestId("default-template");
    expect(defaultTemplate.textContent).toContain("The contents of this document have not been formatted");
    expect(defaultTemplate.textContent).toContain("identifier: example.openattestation.com");
  });

  const badMockResponse = { ok: false };
  it("should render connection error template when SVG cannot be fetched", async () => {
    global.fetch = jest.fn().mockResolvedValue(badMockResponse);
    const svgRef = React.createRef<HTMLIFrameElement>();

    const { findByTestId } = render(<SvgRenderer document={v4WithSvgUrlAndDigestMultibase} svgRef={svgRef} />);

    const defaultTemplate = await findByTestId("default-template");
    expect(defaultTemplate.textContent).toContain("This document might be having loading issues");
    expect(defaultTemplate.textContent).toContain(`URL: “http://mockbucket.com/static/svg_test.svg”`);
  });
});
/* eslint-enable jest/prefer-spy-on */
