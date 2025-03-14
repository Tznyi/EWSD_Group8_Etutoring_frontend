import { useLocation, useNavigate } from "react-router";
import styles from "./MessagePage.module.css";
import { useMessage } from "../../Context/MessageContext";
import { useEffect, useRef, useState } from "react";
import { useTutor } from "../../Context/TutorContext";
import { CircleArrowLeft, Send } from "lucide-react";
import { useUser } from "../../Context/UserContext";
import CenterBox from "../../Components/CenterBox/CenterBox";

function MessagePage() {
  const location = useLocation();
  const selectedId = location.state?.id;

  const [selectedStudent, setSelectedStudent] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [isMessageEdit, setIsMessageEdit] = useState(false);
  const [currentMessageLength, setCurrentMessageLength] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const {
    messageList,
    sendMessage,
    editMessage,
    deleteMessage,
    makeAsRead,
    fetchMessage,
  } = useMessage();
  const { assignedStudents } = useTutor();
  const { user } = useUser();

  const navigate = useNavigate();
  const messageEndRef = useRef(null);

  useEffect(() => {
    setSelectedStudent(
      assignedStudents.find((student) => student.id === parseInt(selectedId))
    );
  }, [assignedStudents, selectedId]);

  useEffect(() => {
    fetchMessage(selectedId);
    makeAsRead(selectedId);
    const interval = setInterval(() => {
      fetchMessage(selectedId);
      makeAsRead(selectedId);
    }, 2500);

    return () => clearInterval(interval);
  }, [selectedId, fetchMessage, makeAsRead]);

  useEffect(() => {
    setCurrentMessageLength(messageList.length);
  }, [messageList]);

  useEffect(() => {
    if (messageList.length !== currentMessageLength)
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList, currentMessageLength]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    if (isMessageEdit) {
      setNewMessage(
        messageList.find((message) => message.id === parseInt(selectedMessage))
          .content
      );
    } else {
      setSelectedMessage(null);
      setNewMessage("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMessageEdit]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (isMessageEdit) {
      if (newMessage.trim() !== "") {
        editMessage(selectedId, selectedMessage, newMessage);
      }
      setIsMessageEdit(false);
    } else {
      if (newMessage.trim() !== "") {
        sendMessage(selectedId, newMessage);
      }
    }

    setNewMessage("");
  };

  function askConfirmation(id, message) {
    setDeleteConfirmation(true);
    setConfirmMessage(message);
    setSelectedMessage(id);
  }

  function clickMessageEdit(id) {
    setIsMessageEdit((curState) => !curState);
    setSelectedMessage(id);
  }

  return (
    <>
      <div className={styles.messageMainframe}>
        <div className={styles.messageHolder}>
          <div className={styles.messageBanner}>
            <div
              className={styles.circularBackBtnHolder}
              onClick={() => navigate(-1)}
            >
              <CircleArrowLeft size={34} />
            </div>
            <img src={selectedStudent.profile_picture} alt="profile-picture" />
            <h2>{selectedStudent.name}</h2>
          </div>
          <div className={styles.bannerUnderline}></div>
          <div className={styles.messageMainGrid}>
            <div className={styles.messageDisplay}>
              {messageList.map((message, index) => {
                return (
                  <div
                    className={`${styles.messageRow} ${
                      message.id === parseInt(selectedMessage) &&
                      styles.selectedMessage
                    }`}
                    key={index}
                    style={
                      message.sender_id === parseInt(user.id)
                        ? { justifyContent: "flex-end" }
                        : { justifyContent: "flex-start" }
                    }
                  >
                    {message.sender_id === parseInt(user.id) && (
                      <div className={styles.threeDots}>
                        <i
                          className={`fa-solid fa-pen-to-square ${styles.editBtn}`}
                          onClick={() => clickMessageEdit(message.id)}
                        ></i>
                        <i
                          className={`fa-solid fa-trash ${styles.deleteBtn}`}
                          onClick={() =>
                            askConfirmation(
                              message.id,
                              "Are you sure you want to delete this message?"
                            )
                          }
                        ></i>
                      </div>
                    )}
                    <div
                      className={`${styles.message} ${
                        message.sender_id === parseInt(user.id)
                          ? styles.messageRight
                          : styles.messageLeft
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messageEndRef}></div>
            </div>
            <form className={styles.commentInputContainer}>
              <input
                type="text"
                id="txtComment"
                placeholder="Write Message"
                className={styles.commentInput}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                autoComplete="off"
              />
              <button
                className={styles.submitButton}
                onClick={(e) => handleMessageSubmit(e)}
              >
                <Send />
              </button>
            </form>
          </div>
        </div>
      </div>

      {deleteConfirmation && (
        <CenterBox closeFun={() => setDeleteConfirmation(false)}>
          {confirmMessage}

          <div className={styles.confirmBtnSec}>
            <div
              className={styles.commentButton}
              onClick={() => {
                setDeleteConfirmation(false);
                deleteMessage(selectedId, selectedMessage);
              }}
            >
              Confirm
            </div>

            <div
              className={styles.cancelButton}
              onClick={() => setDeleteConfirmation(false)}
            >
              Cancel
            </div>
          </div>
        </CenterBox>
      )}
    </>
  );
}

export default MessagePage;
