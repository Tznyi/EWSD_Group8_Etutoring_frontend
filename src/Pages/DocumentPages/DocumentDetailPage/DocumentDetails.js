import React, { useState, useEffect } from "react";
import styles from "./DocumentDetails.module.css";
import { Send, MessageCircleMore, CircleArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useUser } from "../../../Context/UserContext";
import CenterBox from "../../../Components/CenterBox/CenterBox";
import { useDocument } from "../../../Context/DocumentContext";

const DocumentDetails = () => {
  const location = useLocation();
  const selectedId = location.state?.id;

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isDocumentDelete, setDocumentDelete] = useState(false);
  const [isCommentEdit, setIsCommentEdit] = useState(false);

  const navigate = useNavigate();

  const { user } = useUser();

  // reset scroll

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const {
    documentList,
    commentList,
    getComment,
    deleteDocument,

    isContextLoading,
    message,
    hasMessage,
    hasError,
    removeMessage,
    createComment,
    deleteComment,
    updateComment,
  } = useDocument();

  useEffect(() => {
    setSelectedDocument(
      documentList.find((document) => document.id === parseInt(selectedId))
    );
  }, [documentList, selectedId]);

  useEffect(() => {
    if (selectedDocument) {
      getComment(selectedDocument.id);
    }
  }, [selectedDocument, getComment]);

  // date function
  const convertFormattedDate = (date) => {
    return new Date(date).toLocaleString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (isCommentEdit) {
      if (newComment.trim() !== "") {
        updateComment(selectedComment, newComment, selectedId);
      }
      setIsCommentEdit(false);
    } else {
      if (newComment.trim() !== "") {
        createComment(selectedId, newComment);
      }
    }

    setNewComment("");

    setShowInput(false);
  };

  function askConfirmation(id, message, isDocument) {
    setDeleteConfirmation(true);
    setConfirmMessage(message);
    setSelectedComment(id);
    setDocumentDelete(isDocument);
  }

  function handleCloseMessage() {
    removeMessage();
    setDeleteConfirmation(false);
    if (isDocumentDelete) {
      navigate(-1);
    }
  }

  function clickCommentEdit(id) {
    setShowInput(true);
    setIsCommentEdit(true);
    setSelectedComment(id);
    setNewComment(
      commentList.find((comment) => comment.id === parseInt(id)).comment
    );
  }

  function openInNewTab() {
    window.open(selectedDocument.full_url, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className={styles.mainContainer}>
        <div
          className={styles.circularBackBtnHolder}
          onClick={() => navigate(-1)}
        >
          <CircleArrowLeft size={34} />
        </div>

        {selectedDocument && (
          <div className={styles.container}>
            <div className={styles.blogCard}>
              <div className={styles.header}>
                <img
                  src={selectedDocument.user.profile_picture}
                  alt="Author"
                  className={styles.avatar}
                />
                <div>
                  <h3>{selectedDocument.user.name}</h3>
                  <span className={styles.role}>
                    {selectedDocument.user.role}
                  </span>
                </div>
                <span className={styles.date}>
                  {convertFormattedDate(selectedDocument.created_at)}
                </span>
              </div>
              <h2 className={styles.blogTitle}>{selectedDocument.title}</h2>
              <p className={styles.blogContent}>
                {selectedDocument.description}
              </p>
              <div className={styles.fileSection}>
                <i className="fa-solid fa-file"></i>
                <span onClick={() => openInNewTab()}>
                  {selectedDocument.filename}
                </span>
                <span className={styles.date}>2.3mb</span>
              </div>

              <div className={styles.centerButtonContainer}>
                <button
                  className={styles.commentButton}
                  onClick={() => setShowInput(!showInput)}
                >
                  <MessageCircleMore />
                  Comment
                </button>
              </div>

              {selectedDocument.user_id === user.id && (
                <div className={styles.blogEditBtn}>
                  <i
                    className={`fa-solid fa-pen-to-square ${styles.editBtn}`}
                    onClick={() =>
                      navigate("./../updatedocument", {
                        state: { id: selectedId },
                      })
                    }
                  ></i>
                  <i
                    className={`fa-solid fa-trash ${styles.deleteBtn}`}
                    onClick={() =>
                      askConfirmation(
                        selectedId,
                        "Are you sure you want to delete this document",
                        true
                      )
                    }
                  ></i>
                </div>
              )}
            </div>

            {!isContextLoading && (
              <div className={styles.commentSection}>
                {commentList.map((comment, index) => (
                  <div className={styles.comment} key={index}>
                    <img
                      src={comment.user.profile_picture}
                      alt="User"
                      className={styles.avatar}
                    />
                    <div className={styles.content}>
                      <h4>{comment.user.name}</h4>
                      <span className={styles.role}>{comment.user.role}</span>
                      <p>{comment.comment}</p>
                      <span className={styles.date}>
                        {convertFormattedDate(comment.created_at)}
                      </span>
                      {comment.user_id === user.id && (
                        <div className={styles.editNDelete}>
                          <i
                            className={`fa-solid fa-pen-to-square ${styles.editBtn}`}
                            onClick={() => clickCommentEdit(comment.id)}
                          ></i>
                          <i
                            className={`fa-solid fa-trash ${styles.deleteBtn}`}
                            onClick={() =>
                              askConfirmation(
                                comment.id,
                                " Are you sure you want to delete this comment?",
                                false
                              )
                            }
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {showInput && (
                  <form className={styles.commentInputContainer}>
                    <input
                      type="text"
                      id="txtComment"
                      placeholder="Write Comment"
                      className={styles.commentInput}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      autoComplete="off"
                    />
                    <button
                      className={styles.submitButton}
                      onClick={(e) => handleCommentSubmit(e)}
                    >
                      <Send />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --------------- */}

      {deleteConfirmation && (
        <CenterBox closeFun={() => setDeleteConfirmation(false)}>
          {confirmMessage}
          <div className={styles.confirmBtnSec}>
            {isDocumentDelete ? (
              <div
                className={styles.commentButton}
                onClick={() => {
                  deleteDocument(selectedId);
                }}
              >
                Confirm
              </div>
            ) : (
              <div
                className={styles.commentButton}
                onClick={() => {
                  deleteComment(selectedId, selectedComment);
                }}
              >
                Confirm
              </div>
            )}

            <div
              className={styles.cancelButton}
              onClick={() => setDeleteConfirmation(false)}
            >
              Cancel
            </div>
          </div>
        </CenterBox>
      )}

      {hasMessage && (
        <CenterBox closeFun={() => handleCloseMessage()}>{message}</CenterBox>
      )}

      {hasError && (
        <CenterBox closeFun={() => handleCloseMessage()}>{message}</CenterBox>
      )}
    </>
  );
};

export default DocumentDetails;
