import { useEffect, useState } from "react";
import React from "react";
import styles from "./sb.module.css";
import CenterBox from "../../../Components/CenterBox/CenterBox";
import { useLocation, useNavigate } from "react-router";
import { useDocument } from "../../../Context/DocumentContext";
import { CircleArrowLeft } from "lucide-react";

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
    <div className={styles.container}>
      <div
        className={styles.circularBackBtnHolder}
        onClick={() => navigate(-1)}
      >
        <CircleArrowLeft size={34} />
      </div>
      <h2 className={styles.header}>Update Document</h2>
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
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="input-field-group">
            <label htmlFor="description">File Upload</label>
            <input
              type="file"
              className="file-input-field"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </div>
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
    </div>
  );
}

export default UpdateDocument;
