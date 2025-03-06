import { Calendar, MessageCircle, Users } from "lucide-react";
import styles from "./BlogBox.module.css";
import UnderlineLink from "../UnderlineLink/UnderlineLink";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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
  const [displayAssociates, setDisplayAssociates] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (associates.length > 0) {
      setDisplayAssociates(associates.slice(0, 3));
    }
  }, [associates]);

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
        <p>{truncateText(content, 70)}</p>
      </div>
      <div className={styles.blogRelatedSec}>
        <span>
          <Users />{" "}
          {associates.length < 1 ? (
            `${author.role === "student" ? "Assigned Tutor" : "Everyone"}`
          ) : (
            <div className={styles.associateDisplay}>
              <div className={styles.associatesHolder}>
                {displayAssociates.map((associates, index) => (
                  <img
                    key={index}
                    src={associates.profile_picture}
                    style={{ "--index": index + 1 }}
                    alt="profile-picture"
                  />
                ))}
              </div>
              {associates.length - 3 > 0 && (
                <span>{`+ ${associates.length - 3}`}</span>
              )}
            </div>
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
        <UnderlineLink
          onClick={() => navigate("./../blogdetails", { state: { id } })}
        >
          View Details
        </UnderlineLink>
      </div>
    </div>
  );
}

export default BlogBox;
