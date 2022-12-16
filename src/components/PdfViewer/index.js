import React, { useEffect, useState, useCallback } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { getDocument } from "../../services/uploadFile";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./styles.scss";

import testPdf from "../../test3.pdf";

function highlightPattern(text, pattern) {
  return text.replace(pattern, (value) => `<mark>${value}</mark>`);
}

/**
 * Documentation available on
 * https://github.com/wojtekmaj/react-pdf
 * https://github.com/wojtekmaj/react-pdf/wiki/Recipes
 */
export default function PdfViewer() {
  const [searchText, setSearchText] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const textRenderer = useCallback(
    (textItem) => highlightPattern(textItem, searchText),
    [searchText]
  );

  function onChange(event) {
    setSearchText(event.target.value);
  }

  return (
    <div className="container">
      <div>
        <label htmlFor="search">Search:</label>
        <input
          type="search"
          id="search"
          value={searchText}
          onChange={onChange}
        />
      </div>
      <Document file={testPdf} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            className="page"
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            customTextRenderer={textRenderer}
          />
        ))}
      </Document>
    </div>
  );
}
