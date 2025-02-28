import styles from "./DetailView.module.css";
import { CircleArrowLeft } from "lucide-react";
import BlogBox from "../../Components/BlogBox/BlogBox";
import { useBlog } from "../../Context/BlogContext";
import { useLocation, useNavigate } from "react-router";
import BoxLink from "../../Components/BoxLink/BoxLink";
import { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import { useStaff } from "../../Context/StaffContext";

function StaffStudentView() {
  const location = useLocation();
  const selectedId = location.state?.id;

  const [selectedStudent, setSelectedStudent] = useState({});
  const [selectedDisplay, setSelectedDisplay] = useState("Blogs");

  const { individualBlogList, fetchSelectedBlogList } = useBlog();
  const { studentList } = useStaff();
  const { user } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedStudent(
      studentList.find((student) => student.id === parseInt(selectedId))
    );
  }, [studentList, selectedId]);

  useEffect(() => {
    fetchSelectedBlogList(selectedId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

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
                onClick={() => setSelectedDisplay("Files")}
                selected={selectedDisplay === "Files"}
              >
                <span className={styles.bannerNavBtn}>Files</span>
              </BoxLink>
              <BoxLink
                hasBackground={true}
                onClick={() => setSelectedDisplay("Messages")}
                selected={selectedDisplay === "Messages"}
              >
                <span className={styles.bannerNavBtn}>Messages</span>
              </BoxLink>
            </div>
          </div>
          {/* Blog display */}
          <div className={styles.blogSection}>
            <h2>{selectedDisplay}</h2>
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

export default StaffStudentView;
