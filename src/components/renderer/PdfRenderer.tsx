import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { repeat } from "../../utils";
import { Renderer } from "../../types";
import throttle from "lodash.throttle";

pdfjs.GlobalWorkerOptions.workerSrc = "../../../src/pdf.worker";

/**
 * Component rendering pdf attachments. Uses [react-pdf](http://projects.wojtekmaj.pl/react-pdf/) under the hood.
 */

export const PdfRenderer: FunctionComponent<Renderer> = ({ attachment }) => {
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const pdfContainer = useRef(null);

  const setPageWidthWrapper = (): void => {
    const width = (pdfContainer as any).current.getBoundingClient().width;
    setPageWidth(width);
  };

  useEffect(() => {
    window.addEventListener("resize", throttle(setPageWidthWrapper, 500));

    return function cleanup() {
      window.removeEventListener("resize", throttle(setPageWidthWrapper, 500));
    };
  }, []);

  return (
    <Document
      file={`data:application/pdf;base64,${attachment.data}`}
      onLoadSuccess={({ numPages }) => {
        setNumberOfPages(numPages);
      }}
    >
      <style
        scoped
        dangerouslySetInnerHTML={{
          __html: `
      canvas {
        margin: auto;
      }
    `
        }}
      />
      {repeat(numberOfPages)(index => (
        // TODO: Dynamically resize width to fit container
        // https://github.com/wojtekmaj/react-pdf/issues/129
        // not sure if i did correctly
        <div ref={pdfContainer}>
          <Page key={`page_${index + 1}`} pageNumber={index + 1} width={pageWidth} />
        </div>
      ))}
    </Document>
  );
};
