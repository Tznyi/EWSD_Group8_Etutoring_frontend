import { useNavigate } from "react-router";
import { useStudent } from "../../Context/StudentContext";
import styles from "./Report.module.css";
import { useMessage } from "../../Context/MessageContext";
import { useEffect } from "react";
import { BookOpen, Calendar, Upload } from "lucide-react";

function StudentReport() {
  const { tutorInfo } = useStudent();
  const { unreadCount, fetchIndividualUnreadCount } = useMessage();

  const navigate = useNavigate();

  console.log(tutorInfo);

  useEffect(() => {
    fetchIndividualUnreadCount(tutorInfo.id);

    const interval = setInterval(() => {
      fetchIndividualUnreadCount(tutorInfo.id);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchIndividualUnreadCount, tutorInfo]);

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

  return (
    <div className={styles.studentRepMainFrame}>
      <div className={styles.stdNavGrid}>
        <div className={styles.tutorSec} onClick={() => navigate("./../tutor")}>
          {tutorInfo.id ? (
            <>
              <img src={tutorInfo.profile_picture} alt="profile-picture" />
              <div className={styles.tutorInfo}>
                <h4>{tutorInfo.name}</h4>
                <h4>
                  <i className="fa-regular fa-address-card"></i> Tutor
                </h4>
                <h4>
                  {" "}
                  <i className="fa-regular fa-clock"></i>{" "}
                  {convertFormattedDate(tutorInfo.last_active_at)}
                </h4>
              </div>
            </>
          ) : (
            <>
              <img src="/profile-pic.png" alt="profile-picture" />
              <h4>No tutor has been assigned!</h4>
            </>
          )}
        </div>
        <div
          className={`${styles.messageSec} ${
            tutorInfo?.id ? "" : styles.faded
          }`}
          onClick={() => {
            if (tutorInfo.id) {
              navigate("./../message", { state: { id: tutorInfo.id } });
            }
          }}
        >
          {tutorInfo.id ? (
            <>
              <i className="fa-solid fa-comments"></i>
              <h4>MESSAGE</h4>
              {unreadCount > 0 && (
                <span className={styles.unreadCount}>{unreadCount}</span>
              )}
            </>
          ) : (
            <>
              <i className="fa-solid fa-comments"></i>
              <h4>MESSAGE</h4>
              {unreadCount > 0 && (
                <span className={styles.unreadCount}>{unreadCount}</span>
              )}
            </>
          )}
        </div>
        <div className={styles.blogSec} onClick={() => navigate("./../blogs")}>
          <BookOpen size={"3em"} />
          <h3>Blogs</h3>
        </div>
        <div
          className={styles.documentSec}
          onClick={() => navigate("./../documents")}
        >
          <Upload size={"3em"} />
          <h3>Documents</h3>
        </div>
        <div
          className={styles.meetingSec}
          onClick={() => navigate("./../meeting")}
        >
          <Calendar size={"3em"} />
          <h3>Meetings</h3>
        </div>
      </div>
    </div>
  );
}

export default StudentReport;
