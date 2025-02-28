import BlogBox from "../../../Components/BlogBox/BlogBox";
import { useBlog } from "../../../Context/BlogContext";
import { useUser } from "../../../Context/UserContext";
import styles from "./Blogs.module.css";
import { useNavigate } from "react-router";

function Blogs() {
  const { blogList } = useBlog();
  const { user } = useUser();

  const navigate = useNavigate();

  return (
    <div className={styles.blogMainframe}>
      <h2>Blogs</h2>
      {blogList.length < 1 ? (
        <div className={styles.notFound}>No Blogs Found!</div>
      ) : (
        <div className={styles.blogDisplayGrid}>
          {blogList.map((blog, index) => (
            <BlogBox
              id={blog.id}
              author={blog.author}
              title={blog.title}
              content={blog.content}
              associates={blog.students}
              date={blog.created_at}
              comment={blog.comments}
              key={blog.id}
              index={index + 1}
            />
          ))}
        </div>
      )}
      {user.role !== "staff" && (
        <div
          className={styles.floatBtn}
          onClick={() => navigate("./../createblog")}
        >
          <i className="fa-solid fa-pen"></i>
        </div>
      )}
    </div>
  );
}

export default Blogs;
