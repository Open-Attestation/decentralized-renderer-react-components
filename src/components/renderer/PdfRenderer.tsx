import React, { FunctionComponent, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { css } from "@emotion/core";
import { repeat } from "../../utils";
import { Renderer } from "../../types";

const pageStyle = css`
  canvas {
    margin: auto;
  }
`;

// TODO check this https://github.com/wojtekmaj/react-pdf#browserify-and-others
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

/**
 * Component rendering pdf attachments. Uses [react-pdf](http://projects.wojtekmaj.pl/react-pdf/) under the hood.
 */
export const PdfRenderer: FunctionComponent<Renderer> = ({ attachment }) => {
  const [numberOfPages, setNumberOfPages] = useState(0);

  return (
    <Document
      className="container"
      file={`data:application/pdf;base64,${attachment.data}`}
      onLoadSuccess={({ numPages }) => {
        setNumberOfPages(numPages);
      }}
    >
      {repeat(numberOfPages)(index => (
        // TODO: Dynamically resize width to fit container
        // https://github.com/wojtekmaj/react-pdf/issues/129
        <Page css={pageStyle} key={`page_${index + 1}`} pageNumber={index + 1} />
      ))}
    </Document>
  );
};
