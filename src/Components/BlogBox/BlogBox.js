import { Calendar, MessageCircle, Users } from "lucide-react";
import styles from "./BlogBox.module.css";
import UnderlineLink from "../UnderlineLink/UnderlineLink";

function BlogBox({
  id,
  author,
  title,
  content,
  associates,
  date,
  comment,
  index = 0,
}) {
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;

    let trimmedText = text.substring(0, maxLength);
    return trimmedText.substring(0, trimmedText.lastIndexOf(" ")) + "...";
  }

  return (
    <div className={styles.blogBox} style={{ "--index": index }}>
      <div className={styles.authSec}>
        <div className={styles.authPic}>
          <img src={author.profile_picture} alt="profile-pic" />
        </div>
        <div className={styles.authInfo}>
          <h3>{author.name}</h3>
          <span>{author.role}</span>
        </div>
      </div>
      <div className={styles.blogInfoSec}>
        <h3>{truncateText(title, 20)}</h3>
        <p>{truncateText(content, 100)}</p>
      </div>
      <div className={styles.blogRelatedSec}>
        <span>
          <Users />{" "}
          {associates.length < 1 ? (
            `${author.role === "student" ? "Assigned Tutor" : "Everyone"}`
          ) : (
            <></>
          )}
        </span>
        <span>
          <Calendar /> {new Date(date).toLocaleDateString()}
        </span>
        <span>
          <MessageCircle /> {`+${comment.length}`}
        </span>
      </div>
      <div className={styles.linkSec}>
        <UnderlineLink onClick={() => console.log(id)}>
          View Details
        </UnderlineLink>
      </div>
    </div>
  );
}

export default BlogBox;
