import React, { FunctionComponent, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { repeat } from "../../utils";
import { Renderer } from "../../types";

// TODO check this https://github.com/wojtekmaj/react-pdf#browserify-and-others
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

/**
 * Component rendering pdf attachments. Uses [react-pdf](http://projects.wojtekmaj.pl/react-pdf/) under the hood.
 */
export const PdfRenderer: FunctionComponent<Renderer> = ({ attachment }) => {
  const [numberOfPages, setNumberOfPages] = useState(0);

  return (
    <Document
      file={`data:application/pdf;base64,${attachment.data}`}
      onLoadSuccess={({ numPages }) => {
        setNumberOfPages(numPages);
      }}
    >
      <style
        // TODO: The scoped attribute is deprecated and not supported by HTML5. May only be supported by Firefox.
        // eslint-disable-next-line react/no-unknown-property
        scoped
        dangerouslySetInnerHTML={{
          __html: `
      canvas {
        margin: auto;
      }

      :root {
        --react-pdf-text-layer: 1;
        --highlight-bg-color: rgba(180, 0, 170, 1);
        --highlight-selected-bg-color: rgba(0, 100, 0, 1);
      }
      
      @media screen and (forced-colors: active) {
        :root {
          --highlight-bg-color: Highlight;
          --highlight-selected-bg-color: ButtonText;
        }
      }
      
      [data-main-rotation='90'] {
        transform: rotate(90deg) translateY(-100%);
      }
      [data-main-rotation='180'] {
        transform: rotate(180deg) translate(-100%, -100%);
      }
      [data-main-rotation='270'] {
        transform: rotate(270deg) translateX(-100%);
      }
      
      .textLayer {
        position: absolute;
        text-align: initial;
        inset: 0;
        overflow: hidden;
        line-height: 1;
        text-size-adjust: none;
        forced-color-adjust: none;
        transform-origin: 0 0;
        z-index: 2;
      }
      
      .textLayer :is(span, br) {
        color: transparent;
        position: absolute;
        white-space: pre;
        cursor: text;
        margin: 0;
        transform-origin: 0 0;
      }
      
      /* Only necessary in Google Chrome, see issue 14205, and most unfortunately
       * the problem doesn't show up in "text" reference tests. */
      .textLayer span.markedContent {
        top: 0;
        height: 0;
      }
      
      .textLayer .highlight {
        margin: -1px;
        padding: 1px;
        background-color: var(--highlight-bg-color);
        border-radius: 4px;
      }
      
      .textLayer .highlight.appended {
        position: initial;
      }
      
      .textLayer .highlight.begin {
        border-radius: 4px 0 0 4px;
      }
      
      .textLayer .highlight.end {
        border-radius: 0 4px 4px 0;
      }
      
      .textLayer .highlight.middle {
        border-radius: 0;
      }
      
      .textLayer .highlight.selected {
        background-color: var(--highlight-selected-bg-color);
      }
      
      /* Avoids https://github.com/mozilla/pdf.js/issues/13840 in Chrome */
      .textLayer br::selection {
        background: transparent;
      }
      
      .textLayer .endOfContent {
        display: block;
        position: absolute;
        inset: 100% 0 0;
        z-index: -1;
        cursor: default;
        user-select: none;
      }
      
      .textLayer .endOfContent.active {
        top: 0;
      }

      :root {
        --react-pdf-annotation-layer: 1;
        --annotation-unfocused-field-background: url("data:image/svg+xml;charset=UTF-8,<svg width='1px' height='1px' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' style='fill:rgba(0, 54, 255, 0.13);'/></svg>");
        --input-focus-border-color: Highlight;
        --input-focus-outline: 1px solid Canvas;
        --input-unfocused-border-color: transparent;
        --input-disabled-border-color: transparent;
        --input-hover-border-color: black;
        --link-outline: none;
      }
      
      @media screen and (forced-colors: active) {
        :root {
          --input-focus-border-color: CanvasText;
          --input-unfocused-border-color: ActiveText;
          --input-disabled-border-color: GrayText;
          --input-hover-border-color: Highlight;
          --link-outline: 1.5px solid LinkText;
        }
        .annotationLayer .textWidgetAnnotation :is(input, textarea):required,
        .annotationLayer .choiceWidgetAnnotation select:required,
        .annotationLayer .buttonWidgetAnnotation:is(.checkBox, .radioButton) input:required {
          outline: 1.5px solid selectedItem;
        }
      
        .annotationLayer .linkAnnotation:hover {
          backdrop-filter: invert(100%);
        }
      }
      
      .annotationLayer {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        transform-origin: 0 0;
        z-index: 3;
      }
      
      .annotationLayer[data-main-rotation='90'] .norotate {
        transform: rotate(270deg) translateX(-100%);
      }
      .annotationLayer[data-main-rotation='180'] .norotate {
        transform: rotate(180deg) translate(-100%, -100%);
      }
      .annotationLayer[data-main-rotation='270'] .norotate {
        transform: rotate(90deg) translateY(-100%);
      }
      
      .annotationLayer canvas {
        position: absolute;
        width: 100%;
        height: 100%;
      }
      
      .annotationLayer section {
        position: absolute;
        text-align: initial;
        pointer-events: auto;
        box-sizing: border-box;
        margin: 0;
        transform-origin: 0 0;
      }
      
      .annotationLayer .linkAnnotation {
        outline: var(--link-outline);
      }
      
      .annotationLayer :is(.linkAnnotation, .buttonWidgetAnnotation.pushButton) > a {
        position: absolute;
        font-size: 1em;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      
      .annotationLayer :is(.linkAnnotation, .buttonWidgetAnnotation.pushButton) > a:hover {
        opacity: 0.2;
        background: rgba(255, 255, 0, 1);
        box-shadow: 0 2px 10px rgba(255, 255, 0, 1);
      }
      
      .annotationLayer .textAnnotation img {
        position: absolute;
        cursor: pointer;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
      
      .annotationLayer .textWidgetAnnotation :is(input, textarea),
      .annotationLayer .choiceWidgetAnnotation select,
      .annotationLayer .buttonWidgetAnnotation:is(.checkBox, .radioButton) input {
        background-image: var(--annotation-unfocused-field-background);
        border: 2px solid var(--input-unfocused-border-color);
        box-sizing: border-box;
        font: calc(9px * var(--scale-factor)) sans-serif;
        height: 100%;
        margin: 0;
        vertical-align: top;
        width: 100%;
      }
      
      .annotationLayer .textWidgetAnnotation :is(input, textarea):required,
      .annotationLayer .choiceWidgetAnnotation select:required,
      .annotationLayer .buttonWidgetAnnotation:is(.checkBox, .radioButton) input:required {
        outline: 1.5px solid red;
      }
      
      .annotationLayer .choiceWidgetAnnotation select option {
        padding: 0;
      }
      
      .annotationLayer .buttonWidgetAnnotation.radioButton input {
        border-radius: 50%;
      }
      
      .annotationLayer .textWidgetAnnotation textarea {
        resize: none;
      }
      
      .annotationLayer .textWidgetAnnotation :is(input, textarea)[disabled],
      .annotationLayer .choiceWidgetAnnotation select[disabled],
      .annotationLayer .buttonWidgetAnnotation:is(.checkBox, .radioButton) input[disabled] {
        background: none;
        border: 2px solid var(--input-disabled-border-color);
        cursor: not-allowed;
      }
      
      .annotationLayer .textWidgetAnnotation :is(input, textarea):hover,
      .annotationLayer .choiceWidgetAnnotation select:hover,
      .annotationLayer .buttonWidgetAnnotation:is(.checkBox, .radioButton) input:hover {
        border: 2px solid var(--input-hover-border-color);
      }
      .annotationLayer .textWidgetAnnotation :is(input, textarea):hover,
      .annotationLayer .choiceWidgetAnnotation select:hover,
      .annotationLayer .buttonWidgetAnnotation.checkBox input:hover {
        border-radius: 2px;
      }
      
      .annotationLayer .textWidgetAnnotation :is(input, textarea):focus,
      .annotationLayer .choiceWidgetAnnotation select:focus {
        background: none;
        border: 2px solid var(--input-focus-border-color);
        border-radius: 2px;
        outline: var(--input-focus-outline);
      }
      
      .annotationLayer .buttonWidgetAnnotation:is(.checkBox, .radioButton) :focus {
        background-image: none;
        background-color: transparent;
      }
      
      .annotationLayer .buttonWidgetAnnotation.checkBox :focus {
        border: 2px solid var(--input-focus-border-color);
        border-radius: 2px;
        outline: var(--input-focus-outline);
      }
      
      .annotationLayer .buttonWidgetAnnotation.radioButton :focus {
        border: 2px solid var(--input-focus-border-color);
        outline: var(--input-focus-outline);
      }
      
      .annotationLayer .buttonWidgetAnnotation.checkBox input:checked::before,
      .annotationLayer .buttonWidgetAnnotation.checkBox input:checked::after,
      .annotationLayer .buttonWidgetAnnotation.radioButton input:checked::before {
        background-color: CanvasText;
        content: '';
        display: block;
        position: absolute;
      }
      
      .annotationLayer .buttonWidgetAnnotation.checkBox input:checked::before,
      .annotationLayer .buttonWidgetAnnotation.checkBox input:checked::after {
        height: 80%;
        left: 45%;
        width: 1px;
      }
      
      .annotationLayer .buttonWidgetAnnotation.checkBox input:checked::before {
        transform: rotate(45deg);
      }
      
      .annotationLayer .buttonWidgetAnnotation.checkBox input:checked::after {
        transform: rotate(-45deg);
      }
      
      .annotationLayer .buttonWidgetAnnotation.radioButton input:checked::before {
        border-radius: 50%;
        height: 50%;
        left: 30%;
        top: 20%;
        width: 50%;
      }
      
      .annotationLayer .textWidgetAnnotation input.comb {
        font-family: monospace;
        padding-left: 2px;
        padding-right: 0;
      }
      
      .annotationLayer .textWidgetAnnotation input.comb:focus {
        /*
         * Letter spacing is placed on the right side of each character. Hence, the
         * letter spacing of the last character may be placed outside the visible
         * area, causing horizontal scrolling. We avoid this by extending the width
         * when the element has focus and revert this when it loses focus.
         */
        width: 103%;
      }
      
      .annotationLayer .buttonWidgetAnnotation:is(.checkBox, .radioButton) input {
        appearance: none;
      }
      
      .annotationLayer .popupTriggerArea {
        height: 100%;
        width: 100%;
      }
      
      .annotationLayer .fileAttachmentAnnotation .popupTriggerArea {
        position: absolute;
      }
      
      .annotationLayer .popupWrapper {
        position: absolute;
        font-size: calc(9px * var(--scale-factor));
        width: 100%;
        min-width: calc(180px * var(--scale-factor));
        pointer-events: none;
      }
      
      .annotationLayer .popup {
        position: absolute;
        max-width: calc(180px * var(--scale-factor));
        background-color: rgba(255, 255, 153, 1);
        box-shadow: 0 calc(2px * var(--scale-factor)) calc(5px * var(--scale-factor))
          rgba(136, 136, 136, 1);
        border-radius: calc(2px * var(--scale-factor));
        padding: calc(6px * var(--scale-factor));
        margin-left: calc(5px * var(--scale-factor));
        cursor: pointer;
        font: message-box;
        white-space: normal;
        word-wrap: break-word;
        pointer-events: auto;
      }
      
      .annotationLayer .popup > * {
        font-size: calc(9px * var(--scale-factor));
      }
      
      .annotationLayer .popup h1 {
        display: inline-block;
      }
      
      .annotationLayer .popupDate {
        display: inline-block;
        margin-left: calc(5px * var(--scale-factor));
      }
      
      .annotationLayer .popupContent {
        border-top: 1px solid rgba(51, 51, 51, 1);
        margin-top: calc(2px * var(--scale-factor));
        padding-top: calc(2px * var(--scale-factor));
      }
      
      .annotationLayer .richText > * {
        white-space: pre-wrap;
        font-size: calc(9px * var(--scale-factor));
      }
      
      .annotationLayer .highlightAnnotation,
      .annotationLayer .underlineAnnotation,
      .annotationLayer .squigglyAnnotation,
      .annotationLayer .strikeoutAnnotation,
      .annotationLayer .freeTextAnnotation,
      .annotationLayer .lineAnnotation svg line,
      .annotationLayer .squareAnnotation svg rect,
      .annotationLayer .circleAnnotation svg ellipse,
      .annotationLayer .polylineAnnotation svg polyline,
      .annotationLayer .polygonAnnotation svg polygon,
      .annotationLayer .caretAnnotation,
      .annotationLayer .inkAnnotation svg polyline,
      .annotationLayer .stampAnnotation,
      .annotationLayer .fileAttachmentAnnotation {
        cursor: pointer;
      }
      
      .annotationLayer section svg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
      
      .annotationLayer .annotationTextContent {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        color: transparent;
        user-select: none;
        pointer-events: none;
      }
      
      .annotationLayer .annotationTextContent span {
        width: 100%;
        display: inline-block;
      }
    `,
        }}
      />
      {repeat(numberOfPages)((index) => (
        // TODO: Dynamically resize width to fit container
        // https://github.com/wojtekmaj/react-pdf/issues/129
        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      ))}
    </Document>
  );
};
