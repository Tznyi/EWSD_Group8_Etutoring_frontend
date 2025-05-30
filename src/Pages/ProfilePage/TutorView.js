import styles from "./DetailView.module.css";
import { useStudent } from "../../Context/StudentContext";
import { BookOpen } from "lucide-react";
import BlogBox from "../../Components/BlogBox/BlogBox";
import { useBlog } from "../../Context/BlogContext";
import { useLocation, useNavigate } from "react-router";
import BoxLink from "../../Components/BoxLink/BoxLink";
import { useEffect } from "react";
import { useMessage } from "../../Context/MessageContext";

function TutorView() {
  const { tutorInfo } = useStudent();
  const { blogList } = useBlog();

  const navigate = useNavigate();

  const { pathname } = useLocation();
  const { unreadCount, fetchIndividualUnreadCount, isContextLoading } =
    useMessage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
    <>
      {tutorInfo.id ? (
        <div className={styles.tutorMainframe}>
          <div className={styles.bannerHolder}>
            <div className={styles.profileBanner}>
              <div className={styles.picSec}>
                <div className={styles.profilePicHolder}>
                  <img src={tutorInfo.profile_picture} alt="profile-picture" />
                </div>
              </div>
              <div></div>
              <div className={styles.profileInfoSec}>
                <h3>{tutorInfo.name}</h3>
                <span>
                  <i className="fa-regular fa-address-card"></i> Tutor
                </span>
                <span>
                  <i className="fa-regular fa-envelope"></i> {tutorInfo.email}
                </span>
                <span>
                  <i className="fa-regular fa-clock"></i>{" "}
                  {convertFormattedDate(tutorInfo.last_active_at)}
                </span>
              </div>
            </div>
            <div className={styles.bannerNav}>
              <BoxLink
                hasBackground={true}
                onClick={() =>
                  navigate("./../message", { state: { id: tutorInfo.id } })
                }
              >
                <span className={styles.bannerNavBtn}>Messages</span>
                {unreadCount > 0 && !isContextLoading && (
                  <span className={styles.unreadCount}>{unreadCount}</span>
                )}
              </BoxLink>
            </div>
          </div>
          <div className={styles.blogSection}>
            <h2>Blogs</h2>
            <div className={styles.blogDisplayGrid}>
              {blogList
                .slice(0, 5)
                .filter((blog) => blog.author.role === "tutor")
                .map((blog, index) => (
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
              <div className={styles.allBlogLinkHolder}>
                <BoxLink onClick={() => navigate("./../blogs")}>
                  <BookOpen /> View All Blogs
                </BoxLink>
              </div>
            </div>
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

export default TutorView;
