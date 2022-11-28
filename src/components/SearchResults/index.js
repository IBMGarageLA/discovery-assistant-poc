import React, { useState } from "react";
import { Tile, usePrefix } from "@carbon/react";

import "./styles.scss";
import {
  ThumbsDown,
  ThumbsDownFilled,
  ThumbsUp,
  ThumbsUpFilled,
} from "@carbon/icons-react";
import { useGlobalState } from "../../hooks/globalState";
import { postFeedback, updateFeedback } from "../../services/uploadFile";

function SearchResultItem({ document_passages, extracted_metadata }) {
  return (
    <>
      {document_passages?.map((passage, idx) => (
        <SearchResultPassage
          key={idx}
          filename={extracted_metadata?.filename}
          {...passage}
        />
      ))}
    </>
  );
}

function SearchResultPassage({ passage_text, filename }) {
  const [feedback, setFeedback] = useState("");
  const [feedbackDbId, setFeedbackDbId] = useState(null);
  const [feedbackDbRev, setFeedbackDbRev] = useState(null);

  const { userLogged, searchText, company, setLoading } = useGlobalState();

  const userFeedbackHandler = async (userFeedback) => {
    try {
      setLoading(true);
      setFeedback(userFeedback);

      const feedbackObj = {
        email: userLogged?.email,
        searchTerm: searchText,
        company,
        feedback: userFeedback,
        document: filename,
        passage: passage_text,
        timestamp: new Date(),
      };

      if (feedbackDbId === null) {
        const { id, rev } = await postFeedback(feedbackObj);
        setFeedbackDbId(id);
        setFeedbackDbRev(rev);
        console.log("Feedback succesful stored");
      } else {
        feedbackObj._rev = feedbackDbRev;
        const { rev } = await updateFeedback(feedbackDbId, feedbackObj);
        setFeedbackDbRev(rev);
        console.log("Feedback succesful update");
      }
    } catch (error) {
      console.error("Error to store feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const Negative = () => {
    if (feedback === "negative") {
      return <ThumbsDownFilled size="20" />;
    }
    return (
      <ThumbsDown size="20" onClick={() => userFeedbackHandler("negative")} />
    );
  };

  const Positive = () => {
    if (feedback === "positive") {
      return <ThumbsUpFilled size="20" />;
    }
    return (
      <ThumbsUp size="20" onClick={() => userFeedbackHandler("positive")} />
    );
  };

  return (
    <Tile className="document-passage">
      <div
        className="highlight-passage"
        dangerouslySetInnerHTML={{ __html: passage_text }}
      ></div>
      <hr />

      <div className="footer">
        <p className="filename">
          <span>Document: </span>
          {filename}
        </p>
        <div className="user-feedback">
          <Negative />
          <Positive />
        </div>
      </div>
    </Tile>
  );
}

function SearchResults({ data }) {
  const prefix = usePrefix();
  return (
    <div className="content">
      <p className={`${prefix}--file--label`}>Results</p>
      {data?.results?.map((item, idx) => (
        <SearchResultItem key={idx} {...item} />
      ))}
    </div>
  );
}

export default SearchResults;
