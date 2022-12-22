import React, { useState } from "react";
import { Modal, Tile, usePrefix, Loading } from "@carbon/react";

import "./styles.scss";
import {
  ThumbsDown,
  ThumbsDownFilled,
  ThumbsUp,
  ThumbsUpFilled,
} from "@carbon/icons-react";
import { useGlobalState } from "../../hooks/globalState";
import { postFeedback, updateFeedback } from "../../services/uploadFile";
import { DocumentPreview } from "@ibm-watson/discovery-react-components";

import { getDocument } from "../../services/uploadFile";

const PDF_WORKER = "../../assets/pdf.worker.min.js";

const THRESHOLD = 0.2;

function SearchResultItem(r) {
  return (
    <>
      {r.document_passages
        ?.filter((value) =>
          value.answers.every((v) => v.confidence >= THRESHOLD)
        )
        .map((passage, idx) => (
          <SearchResultPassage
            key={idx}
            filename={r.extracted_metadata?.filename}
            html={r.html}
            original={r}
            {...passage}
          />
        ))}
    </>
  );
}

function SearchResultPassage({
  answers,
  passage_text,
  start_offset,
  end_offset,
  field,
  filename,
  html,
  original,
}) {
  const [feedback, setFeedback] = useState("");
  const [feedbackDbId, setFeedbackDbId] = useState(null);
  const [feedbackDbRev, setFeedbackDbRev] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { setDoc } = useGlobalState();
  const { setLoadingDoc } = useGlobalState();

  const relevantAnswer = answers.find((a) => a.confidence >= THRESHOLD);

  const { userLogged, searchText, company, setLoading } = useGlobalState();
  const highlight = {
    end_offset: end_offset,
    field: field,
    passage_text: passage_text,
    start_offset: start_offset,
  };

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
    setLoading(true);
    getDocument(original.extracted_metadata.filename).then((d) => {
      setDoc(d.Body);
      setLoading(false);
    });
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
        data={original}
        passage={passage_text}
        highlight={highlight}
      />
    </Tile>
  );
}

function TextModal({
  title,
  htmlText,
  closeHandler,
  open,
  data,
  passage,
  highlight,
}) {
  const { doc } = useGlobalState();
  const { loading } = useGlobalState();

  return (
    <div>
      {!loading && (
        <Modal
          open={open}
          passiveModal
          modalHeading={title}
          onRequestClose={closeHandler}
        >
          <DocumentPreview
            document={data}
            highlight={highlight}
            pdfWorkerUrl={PDF_WORKER}
            file={doc}
          />
        </Modal>
      )}
    </div>
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
