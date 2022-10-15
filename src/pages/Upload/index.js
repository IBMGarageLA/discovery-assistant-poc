import React, { useState } from "react";
import UploadZone from "../../components/UploadZone";
import { Grid, Column, ToastNotification, Loading } from "@carbon/react";
import "./styles.scss";

function Upload() {
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastTitle, setToastTitle] = useState(null);
  const [toastKind, setToastKind] = useState(null);
  const [toastSubtitle, setToastSubtitle] = useState(null);

  function handleLoadingChange(value) {
    setLoading(value);
  }

  function handleToastOpen(kind, title, subtitle) {
    setToastKind(kind);
    setToastTitle(title);
    setToastSubtitle(subtitle);
    setToastOpen(true);
  }

  function handleToastClose() {
    setToastOpen(false);
    setToastTitle(null);
    setToastTitle(null);
    setToastSubtitle(null);
  }

  return (
    <div className="container">
      {loading && <Loading />}
      {toastOpen && (
        <ToastNotification
          className="toast-container"
          kind={toastKind}
          subtitle={toastSubtitle}
          title={toastTitle}
          hideCloseButton
          timeout={7000}
          onClose={handleToastClose}
        />
      )}
      <Grid fullWidth>
        <Column sm={4} md={8} lg={8}>
          <UploadZone
            notificationHandler={handleToastOpen}
            loadingHandler={handleLoadingChange}
          />
        </Column>
      </Grid>
    </div>
  );
}

export default Upload;
