import { useEffect, useState } from "react";
import React from "react";
import styles from "./sb.module.css";
import CenterBox from "../../../Components/CenterBox/CenterBox";
import { useLocation, useNavigate } from "react-router";
import { useDocument } from "../../../Context/DocumentContext";

function UpdateDocument() {
  const location = useLocation();
  const selectedId = location.state?.id;

  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    documentList,
    updateDocument,
    hasMessage,
    hasError,
    message,
    removeMessage,
  } = useDocument();

  const navigate = useNavigate();

  useEffect(() => {
    const document = documentList.find(
      (document) => document.id === parseInt(selectedId)
    );
    setDocumentTitle(document.title);
    setDocumentDescription(document.description);
  }, [documentList, selectedId]);

  function handleOnSubmit(e) {
    e.preventDefault();

    let newDoc = {
      title: documentTitle,
      description: documentDescription,
    };

    if (selectedFile) {
      newDoc = {
        ...newDoc,
        file: selectedFile,
      };
    }

    updateDocument(selectedId, newDoc);
  }

  function handleFinish() {
    removeMessage();
    navigate(-1);
  }

  return (
    <>
      <h2 className={styles.blogHead}>Update Document</h2>
      <div className={styles.formContainer}>
        <form className={styles.blogForm} onSubmit={(e) => handleOnSubmit(e)}>
          <div className={styles.formGroup}>
            <label className={styles.blogLabel} htmlFor="title">
              Document Title
            </label>
            <input
              className={styles.blogInput}
              type="text"
              id="title"
              name="title"
              placeholder="Enter Document Title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.blogLabel} htmlFor="content">
              Content
            </label>
            <textarea
              className={styles.blogText}
              id="content"
              name="content"
              placeholder="Write Document Context"
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
            ></textarea>
          </div>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <button className="form-submit-btn">Update Document</button>
        </form>
      </div>

      {/* --------------------------------- */}

      {hasMessage && (
        <CenterBox closeFun={() => handleFinish()}>{message}</CenterBox>
      )}

      {hasError && (
        <CenterBox closeFun={() => removeMessage()}>{message}</CenterBox>
      )}
    </>
  );
}

export default UpdateDocument;
