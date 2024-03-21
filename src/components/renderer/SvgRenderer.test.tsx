/* eslint-disable */

// Valid / Invalid urls
// v4 with Svg url with response and multibase - DONE
// v4 with Svg data and multibase - DONE
// v2 with Svg url with response and multibase - DONE

// v4 with Svg url with tampered response and multibase - DONE
// v4 with tampered Svg data - DONE

// v4 with Svg url with tampered response and no multibase - DONE

// v4 with Svg url with bad response and multibase

// import React from "react";
import { v4 } from "@govtechsg/open-attestation";
import { act, findByTestId, render } from "@testing-library/react";
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
} from "./fixtures/svgRendererSamples";

// const yes = mockResponse.blob().then((res) => {
//   res.text().then((r2s) => {
//     console.log(r2s);
//     // console.log(v4WithSvgUrlAndDigestMultibase.renderMethod.idAlso);
//   });
// });

describe("SvgRenderer component", () => {
  const mockSvg = fs.readFileSync("./src/components/renderer/fixtures/example_cert.svg");
  const mockSvgBlob = new Blob([mockSvg], { type: "image/svg+xml" });
  const mockResponse = { blob: () => Promise.resolve(mockSvgBlob) };

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
    const svgUrl = v4WithEmbeddedSvgAndDigestMultibase.renderMethod.id;

    const { findByTitle } = render(
      <SvgRenderer svgData={svgUrl} document={v4WithEmbeddedSvgAndDigestMultibase} svgRef={svgRef} />
    );

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

  const tamperedSvgBuffer = Buffer.concat([mockSvg, Buffer.from([0x12, 0x34])]); // Add some random bytes
  const tamperedSvgBlob = new Blob([tamperedSvgBuffer], { type: "image/svg+xml" });
  const tamperedMockResponse = { blob: () => Promise.resolve(tamperedSvgBlob) };

  it("should render default template when SVG at URL has been tampered with", async () => {
    global.fetch = jest.fn().mockResolvedValue(tamperedMockResponse);
    const svgRef = React.createRef<HTMLIFrameElement>();
    const svgUrl = v4WithSvgUrlAndDigestMultibase.renderMethod.id;

    const { findByTestId } = render(
      <SvgRenderer svgData={svgUrl} document={v4WithSvgUrlAndDigestMultibase} svgRef={svgRef} />
    );

    const defaultTemplate = await findByTestId("default-template");
    expect(defaultTemplate.textContent).toContain("This document might be having loading issues");
    expect(defaultTemplate.textContent).toContain(`URL: “http://mockbucket.com/static/svg_test.svg”`);
  });

  it("should render default template when embedded SVG has somehow also been tampered with", async () => {
    // Leaving this in since users can pre-load and directly pass in the svg data, but we can technically add another check to remove
    global.fetch = jest.fn().mockResolvedValue(tamperedMockResponse);
    const svgRef = React.createRef<HTMLIFrameElement>();
    const svgUrl = v4WithTamperedEmbeddedSvgAndDigestMultibase.renderMethod.id;

    const { findByTestId } = render(
      <SvgRenderer svgData={svgUrl} document={v4WithTamperedEmbeddedSvgAndDigestMultibase} svgRef={svgRef} />
    );

    const defaultTemplate = await findByTestId("default-template");
    expect(defaultTemplate.textContent).toContain("This document might be having loading issues");
    // expect(defaultTemplate.textContent).toContain(`URL: “http://mockbucket.com/static/svg_test.svg”`); // TODO: Update default renderer to handle this case
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
});
