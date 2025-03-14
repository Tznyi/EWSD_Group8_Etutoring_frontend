import { useState } from "react";
import React from "react";
import styles from "./sb.module.css";
import { useUser } from "../../../Context/UserContext";
import CenterBox from "../../../Components/CenterBox/CenterBox";
import { useTutor } from "../../../Context/TutorContext";
import { useBlog } from "../../../Context/BlogContext";
import { useNavigate } from "react-router";
import { CircleArrowLeft } from "lucide-react";

function CreateBlog() {
  const [showPopup, setShowPopup] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [selectedStudentList, setSelectedStudentList] = useState([]);

  const { user } = useUser();
  const { assignedStudents } = useTutor();
  const {
    createBlog,
    hasMessage,
    hasError,
    message,
    removeMessage,
    isContextLoading,
  } = useBlog();

  const tutorStudents = user.role === "tutor" ? assignedStudents : null;

  const navigate = useNavigate();

  function handleSelect(id) {
    if (selectedStudentList.filter((st) => st === id).length === 0) {
      setSelectedStudentList((curArray) => [...curArray, id]);
    } else {
      setSelectedStudentList((curArray) =>
        curArray.filter((item) => item !== id)
      );
    }
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    if (isContextLoading) return;
    const newBlog = {
      title: blogTitle,
      content: blogContent,
      student_ids: selectedStudentList,
    };

    createBlog(newBlog);
  }

  function handleFinish() {
    removeMessage();
    navigate(-1);
  }

  return (
    <div className={styles.container}>
      <div className={styles.circularBackBtnHolder} onClick={() => navigate(-1)}>
        <CircleArrowLeft size={34} />
      </div>
      <h2 className={styles.header}>Create A New Blog</h2>
      <div className={styles.blogFormContainer}>
        {user.role === "tutor" && (
          <button className={styles.tagBtn} onClick={() => setShowPopup(true)}>
            Tag Student<i style={{margin:'0 10px'}} className="fa-solid fa-users"></i>
            {selectedStudentList.length > 0
              ? ` x ${selectedStudentList.length}`
              : " Everyone"}
          </button>
        )}

        {showPopup && (
          <CenterBox closeFun={() => setShowPopup(false)}>
            <div className={styles.popupContent}>
              <h3>Select Student</h3>
              <div className={styles.studentListContainer}>
                {tutorStudents.map((student) => (
                  <div key={student.id} className={styles.studentList}>
                    <img
                      src={student.profile_picture}
                      alt={student.name}
                      className={styles.studentPhoto}
                    />
                    <span className={styles.studentName}>{student.name}</span>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={selectedStudentList.includes(student.id)}
                        onChange={() => handleSelect(student.id)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                ))}
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </CenterBox>
        )}

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
              placeholder="Enter Blog Title"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              required
            />
          </div>
          <div className="input-field-group">
            <label htmlFor="content">
              Content
            </label>
            <textarea
              className=" textarea-field"
              id="content"
              name="content"
              placeholder="Enter Blog Context"
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
              required
            ></textarea>
          </div>
          <button className="form-submit-btn">Upload Blog</button>
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

export default CreateBlog;
