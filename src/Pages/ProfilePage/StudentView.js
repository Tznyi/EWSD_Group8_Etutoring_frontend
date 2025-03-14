import styles from "./DetailView.module.css";
import { CircleArrowLeft } from "lucide-react";
import BlogBox from "../../Components/BlogBox/BlogBox";
import { useBlog } from "../../Context/BlogContext";
import { useLocation, useNavigate } from "react-router";
import BoxLink from "../../Components/BoxLink/BoxLink";
import { useEffect, useState } from "react";
import { useTutor } from "../../Context/TutorContext";
import { useUser } from "../../Context/UserContext";
import { useDocument } from "../../Context/DocumentContext";
import DocumentBox from "../../Components/DocumentBox/DocumentBox";
import { useMessage } from "../../Context/MessageContext";

function StudentView() {
  const location = useLocation();
  const selectedId = location.state?.id;

  const [selectedStudent, setSelectedStudent] = useState({});
  const [selectedDisplay, setSelectedDisplay] = useState("Blogs");

  const { individualBlogList, fetchSelectedBlogList } = useBlog();
  const { individualDocumentList, fetchSelectedDocumentList } = useDocument();

  const { assignedStudents } = useTutor();
  const { unreadCount, fetchIndividualUnreadCount, isContextLoading } =
    useMessage();
  const { user } = useUser();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setSelectedStudent(
      assignedStudents.find((student) => student.id === parseInt(selectedId))
    );
  }, [assignedStudents, selectedId]);

  useEffect(() => {
    fetchSelectedBlogList(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    fetchSelectedDocumentList(selectedId);
  }, [fetchSelectedDocumentList, selectedId]);

  useEffect(() => {
    fetchIndividualUnreadCount(selectedId);

    const interval = setInterval(() => {
      fetchIndividualUnreadCount(selectedId);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchIndividualUnreadCount, selectedId]);

  return (
    <>
      {selectedStudent.id ? (
        <div className={styles.tutorMainframe}>
          <div
            className={styles.circularBackBtnHolder}
            onClick={() => navigate(-1)}
          >
            <CircleArrowLeft size={34} />
          </div>
          <div className={styles.bannerHolder}>
            <div className={styles.profileBanner}>
              <div className={styles.picSec}>
                <div className={styles.profilePicHolder}>
                  <img
                    src={selectedStudent.profile_picture}
                    alt="profile-picture"
                  />
                </div>
              </div>
              <div></div>
              <div className={styles.profileInfoSec}>
                <h3>{selectedStudent.name}</h3>
                <span>
                  <i className="fa-regular fa-address-card"></i> Student
                </span>
                <span>
                  <i className="fa-solid fa-chalkboard-user"></i>{" "}
                  {user.role === "tutor"
                    ? user.name
                    : selectedStudent.tutor.name}
                </span>
                <span>
                  <i className="fa-regular fa-envelope"></i>{" "}
                  {selectedStudent.email}
                </span>
              </div>
            </div>
            <div className={styles.bannerNav}>
              <BoxLink
                hasBackground={true}
                onClick={() => setSelectedDisplay("Blogs")}
                selected={selectedDisplay === "Blogs"}
              >
                <span className={styles.bannerNavBtn}>Blogs</span>
              </BoxLink>
              <BoxLink
                hasBackground={true}
                onClick={() => setSelectedDisplay("Documents")}
                selected={selectedDisplay === "Documents"}
              >
                <span className={styles.bannerNavBtn}>Documents</span>
              </BoxLink>
              <BoxLink
                hasBackground={true}
                onClick={() =>
                  navigate("./../message", { state: { id: selectedId } })
                }
                selected={selectedDisplay === "Messages"}
              >
                <span className={styles.bannerNavBtn}>Messages</span>
                {unreadCount > 0 && !isContextLoading && (
                  <span className={styles.unreadCount}>{unreadCount}</span>
                )}
              </BoxLink>
            </div>
          </div>
          {/* Blog display */}
          <div className={styles.blogSection}>
            <h2>{selectedDisplay}</h2>
            {/* Blogs */}
            {selectedDisplay === "Blogs" && (
              <>
                {individualBlogList.length < 1 ? (
                  <div className={styles.notFound}>No Blogs Found!</div>
                ) : (
                  <div className={styles.blogDisplayGrid}>
                    {individualBlogList.map((blog, index) => (
                      <BlogBox
                        id={blog.id}
                        author={blog.author}
                        title={blog.title}
                        content={blog.content}
                        associates={blog.students}
                        date={blog.created_at}
                        comment={blog.comments}
                        key={blog.id} // Use blog.id as key for better performance
                        index={index + 1}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            {/* Documents */}
            {selectedDisplay === "Documents" && (
              <>
                {individualDocumentList?.length < 1 ? (
                  <div className={styles.notFound}>No Documents Found!</div>
                ) : (
                  <div className={styles.documentDisplayGrid}>
                    {individualDocumentList?.map((document, index) => (
                      <DocumentBox
                        id={document.id}
                        author={document.user}
                        title={document.title}
                        filename={document.filename}
                        fileurl={document.file_url}
                        date={document.created_at}
                        comment={document.comments}
                        noDelete={true}
                        key={document.id}
                        index={index + 1}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.notFound}>
          No Tutor has been Assigned! <br /> Please wait.
        </div>
      )}
    </>
  );
}

export default StudentView;
