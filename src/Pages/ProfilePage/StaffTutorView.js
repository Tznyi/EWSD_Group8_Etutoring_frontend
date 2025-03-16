import styles from "./DetailView.module.css";
import { CircleArrowLeft } from "lucide-react";
import BlogBox from "../../Components/BlogBox/BlogBox";
import { useBlog } from "../../Context/BlogContext";
import { useLocation, useNavigate } from "react-router";
import BoxLink from "../../Components/BoxLink/BoxLink";
import { useEffect, useState } from "react";
import { useStaff } from "../../Context/StaffContext";
import { useDocument } from "../../Context/DocumentContext";
import DocumentBox from "../../Components/DocumentBox/DocumentBox";

function StaffTutorView() {
  const location = useLocation();
  const selectedId = location.state?.id;

  const [selectedTutor, setSelectedTutor] = useState({});
  const [selectedDisplay, setSelectedDisplay] = useState("Blogs");

  const { individualBlogList, fetchSelectedBlogList } = useBlog();
  const { individualDocumentList, fetchSelectedDocumentList } = useDocument();
  const { tutorList } = useStaff();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setSelectedTutor(
      tutorList.find((tutor) => tutor.id === parseInt(selectedId))
    );
  }, [tutorList, selectedId]);

  useEffect(() => {
    fetchSelectedBlogList(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    fetchSelectedDocumentList(selectedId);
  }, [fetchSelectedDocumentList, selectedId]);

  function handleBack() {
    navigate(-1);
  }

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
    <>
      {selectedTutor.id ? (
        <div className={styles.tutorMainframe}>
          <div
            className={styles.circularBackBtnHolder}
            onClick={() => handleBack()}
          >
            <CircleArrowLeft size={34} />
          </div>
          <div className={styles.bannerHolder}>
            <div className={styles.profileBanner}>
              <div className={styles.picSec}>
                <div className={styles.profilePicHolder}>
                  <img
                    src={selectedTutor.profile_picture}
                    alt="profile-picture"
                  />
                </div>
              </div>
              <div></div>
              <div className={styles.profileInfoSec}>
                <h3>{selectedTutor.name}</h3>
                <span>
                  <i className="fa-regular fa-address-card"></i> Tutor
                </span>
                <span>
                  <i className="fa-regular fa-envelope"></i>{" "}
                  {selectedTutor.email}
                </span>
                <span>
                  <i className="fa-regular fa-clock"></i>{" "}
                  {convertFormattedDate(selectedTutor.last_active_at)}
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

export default StaffTutorView;
