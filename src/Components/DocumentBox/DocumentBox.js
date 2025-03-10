import styles from "./DocumentBox.module.css";
import { useNavigate } from "react-router";
// import { useUser } from "../../Context/UserContext";
import { Calendar, MessageCircle } from "lucide-react";

function DocumentBox({
  id,
  author,
  title,
  filename,
  fileurl,
  date,
  comment,
  handleDelete,
  noDelete = false,
  index = 0,
}) {
  // const { user } = useUser();

  const navigate = useNavigate();

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;

    let trimmedText = text.substring(0, maxLength);
    return trimmedText.substring(0, trimmedText.lastIndexOf(" ")) + "...";
  }

  function openInNewTab() {
    window.open(fileurl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={styles.blogBox} style={{ "--index": index }}>
      <div className={styles.authSec}>
        <div className={styles.authPic}>
          <img src={author.profile_picture} alt="profile-picture" />
        </div>
        <span>{author.name}</span>
      </div>
      <div className={styles.documentInfoSec}>
        <h3>{truncateText(title, 100)}</h3>
        <div className={styles.docFileInfo}>
          {`${filename?.split(".").pop()} | 2.3mb`}
          <span>
            <Calendar size={"20px"} />{" "}
            {`${new Date(date).toLocaleDateString()}`}
          </span>
          <span>
            <MessageCircle size={"20px"} /> {`+${comment.length}`}
          </span>
        </div>
      </div>
      <div className={styles.documentActionSec}>
        <i
          className={`fa-solid fa-eye ${styles.view}`}
          onClick={() =>
            navigate("./../documentdetails", { state: { id: id } })
          }
        ></i>
        <i
          className={`fa-solid fa-download ${styles.download}`}
          onClick={() => openInNewTab()}
        ></i>
        {/* {(user.id === parseInt(author.id) || !noDelete) && (
          <i
            className={`fa-solid fa-trash ${styles.delete}`}
            onClick={() => handleDelete(id)}
          ></i>
        )} */}
      </div>
    </div>
  );
}

export default DocumentBox;
