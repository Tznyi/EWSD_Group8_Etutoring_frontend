import { useState } from "react";
import React from "react";
import styles from "./sb.module.css";
import CenterBox from "../../../Components/CenterBox/CenterBox";
import { useNavigate } from "react-router";
import { useDocument } from "../../../Context/DocumentContext";

function CreateDocument() {
  const [documentTitle, setDocumentTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const {
    createDocument,
    hasMessage,
    hasError,
    message,
    removeMessage,
    isContextLoading,
  } = useDocument();

  const navigate = useNavigate();

  function handleOnSubmit(e) {
    e.preventDefault();
    if (isContextLoading) return;
    if (!file) {
      alert("Please select a file!");
      return;
    }

    const newDocument = {
      title: documentTitle,
      description: description,
      file: file,
    };

    createDocument(newDocument);
  }

  function handleFinish() {
    removeMessage();
    navigate(-1);
  }

  return (
    <>
      <h2 className={styles.blogHead}>Create New Document</h2>
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <button className="form-submit-btn">Upload Document</button>
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

export default CreateDocument;
