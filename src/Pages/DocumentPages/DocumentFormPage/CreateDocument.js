import { useState } from "react";
import React from "react";
import styles from "./sb.module.css";
import CenterBox from "../../../Components/CenterBox/CenterBox";
import { useNavigate } from "react-router";
import { useDocument } from "../../../Context/DocumentContext";
import { CircleArrowLeft } from "lucide-react";

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

    console.log(newDocument);

    createDocument(newDocument);
  }

  function handleFinish() {
    removeMessage();
    navigate(-1);
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.circularBackBtnHolder}
        onClick={() => navigate(-1)}
      >
        <CircleArrowLeft size={34} />
      </div>
      <h2 className={styles.header}>Upload A New Document</h2>
      <div className={styles.documentFormContainer}>
        <form
          style={{ width: "100%" }}
          className=" form-wrapper"
          onSubmit={(e) => handleOnSubmit(e)}
        >
          <div className="input-field-group">
            <label htmlFor="title">Title</label>
            <input
              className="input-field"
              type="text"
              id="title"
              name="title"
              placeholder="Enter Title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              required
            />
          </div>
          <div className="input-field-group">
            <label htmlFor="description">Description</label>
            <textarea
              className=" textarea-field"
              id="description"
              name="description"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="input-field-group">
            <label htmlFor="description">File Upload</label>
            <input
              type="file"
              className="file-input-field"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
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
    </div>
  );
}

export default CreateDocument;
