import React from "react";
import { Tile, usePrefix } from "@carbon/react";
import "./styles.scss";

function SearchResultItem(props) {
  return (
    <>
      {props?.document_passages?.map((passage, idx) => (
        <SearchResultPassage
          key={idx}
          filename={props?.extracted_metadata?.filename}
          {...passage}
        />
      ))}
    </>
  );
}

function SearchResultPassage(props) {
  return (
    <Tile className="document-passage">
      <p className="filename">
        <span>Document: </span>
        {props?.filename}
      </p>

      <div
        className="highlight-passage"
        dangerouslySetInnerHTML={{ __html: props?.passage_text }}
      ></div>
    </Tile>
  );
}

function SearchResults(props) {
  const prefix = usePrefix();
  return (
    <div className="content">
      <p className={`${prefix}--file--label`}>Results</p>
      {props?.data?.results?.map((item, idx) => (
        <SearchResultItem key={idx} {...item} />
      ))}
    </div>
  );
}

export default SearchResults;
