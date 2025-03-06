import React, { useState, useEffect } from "react";
import styles from "./BlogDetails.module.css";
import { Send, MessageCircleMore, CircleArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useBlog } from "../../../Context/BlogContext";
import { useUser } from "../../../Context/UserContext";
import CenterBox from "../../../Components/CenterBox/CenterBox";

const BlogDetails = () => {
  const location = useLocation();
  const selectedId = location.state?.id;

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isBlogDelete, setIsBlogDelete] = useState(false);

  const navigate = useNavigate();

  const { user } = useUser();
  const {
    blogList,
    commentList,
    isContextLoading,
    getComment,
    createComment,
    deleteBlog,
    deleteComment,
    message,
    hasMessage,
    hasError,
    removeMessage,
  } = useBlog();

  useEffect(() => {
    setSelectedBlog(blogList.find((blog) => blog.id === parseInt(selectedId)));
  }, [blogList, selectedId]);

  useEffect(() => {
    if (selectedBlog) {
      getComment(selectedBlog.id);
    }
  }, [selectedBlog, getComment]);

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
    if (newComment.trim() !== "") {
      createComment(selectedId, newComment);
    }

    setShowInput(false);
  };

  function askConfirmation(id, message, isBlog) {
    setDeleteConfirmation(true);
    setConfirmMessage(message);
    setSelectedComment(id);
    setIsBlogDelete(isBlog);
  }

  function handleCloseMessage() {
    removeMessage();
    setDeleteConfirmation(false);
    if (isBlogDelete) {
      navigate(-1);
    }
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

        {selectedBlog && (
          <div className={styles.container}>
            <div className={styles.blogCard}>
              <div className={styles.header}>
                <img
                  src={selectedBlog.author.profile_picture}
                  alt="Author"
                  className={styles.avatar}
                />
                <div>
                  <h3>{selectedBlog.author.name}</h3>
                  <span className={styles.role}>
                    {selectedBlog.author.role}
                  </span>
                </div>
                <span className={styles.date}>
                  {convertFormattedDate(selectedBlog.created_at)}
                </span>
              </div>
              <h2 className={styles.blogTitle}>{selectedBlog.title}</h2>
              <p className={styles.blogContent}>{selectedBlog.content}</p>

              <div className={styles.centerButtonContainer}>
                <button
                  className={styles.commentButton}
                  onClick={() => setShowInput(!showInput)}
                >
                  <MessageCircleMore />
                  Comment
                </button>
              </div>

              {selectedBlog.user_id === user.id && (
                <div className={styles.blogEditBtn}>
                  <i
                    className={`fa-solid fa-pen-to-square ${styles.editBtn}`}
                    onClick={() =>
                      navigate("./../updateblog", { state: { id: selectedId } })
                    }
                  ></i>
                  <i
                    className={`fa-solid fa-trash ${styles.deleteBtn}`}
                    onClick={() =>
                      askConfirmation(
                        selectedId,
                        "Are you sure you want to delete this blog",
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
            {isBlogDelete ? (
              <div
                className={styles.commentButton}
                onClick={() => {
                  deleteBlog(selectedId);
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

export default BlogDetails;
