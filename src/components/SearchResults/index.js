import React, { useState } from "react";
import { Modal, Tile, usePrefix } from "@carbon/react";

import "./styles.scss";
import {
  ThumbsDown,
  ThumbsDownFilled,
  ThumbsUp,
  ThumbsUpFilled,
} from "@carbon/icons-react";
import { useGlobalState } from "../../hooks/globalState";
import { postFeedback, updateFeedback } from "../../services/uploadFile";

function SearchResultItem({
  document_passages,
  extracted_metadata,
  html,
  text,
}) {
  return (
    <>
      {document_passages?.map((passage, idx) => (
        <SearchResultPassage
          key={idx}
          filename={extracted_metadata?.filename}
          html={html}
          {...passage}
        />
      ))}
    </>
  );
}

function SearchResultPassage({ answers, passage_text, filename, html }) {
  const [feedback, setFeedback] = useState("");
  const [feedbackDbId, setFeedbackDbId] = useState(null);
  const [feedbackDbRev, setFeedbackDbRev] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const relevantAnswer = answers.find((a) => a.confidence >= 0.3);

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

  const handleModalOpen = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleModalClose = (e) => {
    e.preventDefault();
    setModalOpen(false);
  };

  return (
    <Tile className="document-passage">
      <div
        className="highlight-passage"
        dangerouslySetInnerHTML={{ __html: passage_text }}
      ></div>

      {relevantAnswer && (
        <>
          <hr />
          <div className="footer">
            <p className="answer">
              <span className="bold">Answer: </span>
              <span>{relevantAnswer.answer_text}</span>
            </p>
            <div className="answer">
              <span className="bold">Confidence: </span>
              <span>{(relevantAnswer.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        </>
      )}

      <hr />

      <div className="footer">
        <p className="filename">
          <span className="bold">Document: </span>
          <span onClick={handleModalOpen}>{filename}</span>
        </p>
        <div className="user-feedback">
          <Negative />
          <Positive />
        </div>
      </div>
      <TextModal
        title={filename}
        open={modalOpen}
        closeHandler={handleModalClose}
        htmlText={html}
      />
    </Tile>
  );
}

function TextModal({ title, htmlText, closeHandler, open }) {
  return (
    <Modal
      open={open}
      passiveModal
      modalHeading={title}
      onRequestClose={closeHandler}
    >
      <div
        className="highlight-document"
        dangerouslySetInnerHTML={{ __html: htmlText }}
      ></div>
    </Modal>
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
