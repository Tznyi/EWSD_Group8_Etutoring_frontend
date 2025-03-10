import styles from "./DetailView.module.css";
import { useStudent } from "../../Context/StudentContext";
import { BookOpen } from "lucide-react";
import BlogBox from "../../Components/BlogBox/BlogBox";
import { useBlog } from "../../Context/BlogContext";
import { useLocation, useNavigate } from "react-router";
import BoxLink from "../../Components/BoxLink/BoxLink";
import { useEffect } from "react";

function TutorView() {
  const { tutorInfo } = useStudent();
  const { blogList } = useBlog();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {tutorInfo.id ? (
        <div className={styles.tutorMainframe}>
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
                  <BookOpen /> View All Booking
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
