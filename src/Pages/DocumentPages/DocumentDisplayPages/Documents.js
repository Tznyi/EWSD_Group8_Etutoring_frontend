import { useEffect } from "react";
import DocumentBox from "../../../Components/DocumentBox/DocumentBox";
import { useDocument } from "../../../Context/DocumentContext";
import { useUser } from "../../../Context/UserContext";
import styles from "./Documents.module.css";
import { useLocation, useNavigate } from "react-router";

function Documents() {
  const { user } = useUser();
  const { documentList, fetchDocument } = useDocument();

  const navigate = useNavigate();

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  // reset scroll

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <div className={styles.blogMainframe}>
        <h2>Documents</h2>
        {documentList.length < 1 ? (
          <div className={styles.notFound}>No Documents Found!</div>
        ) : (
          <div className={styles.documentDisplayGrid}>
            {documentList.map((document, index) => (
              <DocumentBox
                id={document.id}
                author={document.user}
                title={document.title}
                filename={document.filename}
                fileurl={document.full_url}
                date={document.created_at}
                comment={document.comments}
                key={document.id}
                index={index + 1}
              />
            ))}
          </div>
        )}
        {user.role !== "staff" && (
          <div
            className={styles.floatBtn}
            onClick={() => navigate("./../createdocument")}
          >
            <i className="fa-solid fa-file-arrow-up"></i>
          </div>
        )}
      </div>
    </>
  );
}

export default Documents;
