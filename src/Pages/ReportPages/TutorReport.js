import { useEffect, useState } from "react";
import { useTutor } from "../../Context/TutorContext";
import styles from "./Report.module.css";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router";
import { useBlog } from "../../Context/BlogContext";

// temp data

function TutorReport() {
  const [selectedDisplay, setSelectedDisplay] = useState("Assigned Students");
  const [displayList, setDisplayList] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemPerPage = 5;
  const offset = currentPage * itemPerPage;
  const paginatedItems = displayList.slice(offset, offset + itemPerPage);

  const { assignedStudents, inactiveStudents } = useTutor();
  const { blogList, clearSelect } = useBlog();

  const navigate = useNavigate();

  useEffect(() => {
    setDisplayList(assignedStudents);
    setSelectedDisplay("Assigned Students");
  }, [assignedStudents]);

  useEffect(() => {
    clearSelect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [displayList]);

  function handleAssignedStudent() {
    setSelectedDisplay("Assigned Students");
    setDisplayList(assignedStudents);
  }

  function handleInactiveStudent() {
    setSelectedDisplay("Inactive Students");
    setDisplayList(inactiveStudents);
  }

  function handlePageChange({ selected }) {
    setCurrentPage(selected);
  }

  function handleViewDetails(id) {
    navigate("./../studentdetails", { state: { id: id } });
  }

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;

    let trimmedText = text.substring(0, maxLength);
    return trimmedText.substring(0, trimmedText.lastIndexOf(" ")) + "...";
  }

  return (
    <div className={styles.reportLayout}>
      <div className={styles.selectionGrid}>
        <div
          className={styles.selectionBox}
          onClick={() => handleAssignedStudent()}
        >
          <i className="fa-solid fa-user-group"></i>
          <div className={styles.boxInfoSection}>
            <h3>Students</h3>
            <h4>
              <span className={styles.coloredText}>
                {assignedStudents.length}
              </span>
              /20
            </h4>
          </div>
        </div>
        <div
          className={styles.selectionBox}
          onClick={() => handleInactiveStudent()}
        >
          <i className="fa-solid fa-user-clock"></i>
          <div className={styles.boxInfoSection}>
            <h3>Inactive Students</h3>
            <h4>
              <span className={styles.coloredText}>
                {inactiveStudents.length}
              </span>
              /{assignedStudents.length}
            </h4>
          </div>
        </div>
      </div>
      <div className={styles.reportDisplay}>
        <div className={styles.tableDisplay}>
          <h3>{selectedDisplay}</h3>
          <div className={styles.tableHolder}>
            {displayList.length > 0 ? (
              <table className={styles.tableStyle}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th className={styles.hidableCol}>Picture</th>
                    <th>Name</th>
                    <th className={styles.hidableCol}>Email</th>
                    <th>Last Seen</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((student, index) => {
                    let newDate = new Date(
                      student.created_at
                    ).toLocaleDateString();

                    if (student.last_login) {
                      newDate = new Date(
                        student.last_login
                      ).toLocaleDateString();
                    }
                    return (
                      <tr key={index}>
                        <td>
                          {(currentPage + 1) * itemPerPage +
                            (index + 1) -
                            itemPerPage}
                        </td>

                        <td
                          className={`${styles.tableImageBox} ${styles.hidableCol}`}
                        >
                          <div className={styles.tableImageHolder}>
                            <img
                              src={student.profile_picture}
                              alt="profile-pic"
                            />
                          </div>
                        </td>
                        <td>{student.name}</td>
                        <td className={styles.hidableCol}>{student.email}</td>
                        <td>{newDate}</td>
                        <td>
                          <span
                            className={styles.link}
                            onClick={() => handleViewDetails(student.id)}
                          >
                            View Details
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className={styles.notFound}>Found No Records!</div>
            )}
          </div>
          <div className={styles.pageNavHolder}>
            {selectedDisplay === "Assigned Students" && (
              <ReactPaginate
                previousLabel={<i className="fa-solid fa-left-long"></i>}
                nextLabel={<i className="fa-solid fa-right-long"></i>}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(assignedStudents.length / itemPerPage)}
                marginPagesDisplayed={3}
                pageRangeDisplayed={3}
                onPageChange={handlePageChange}
                containerClassName={styles.pageListArray}
                activeClassName={styles.currentPage}
                pageLinkClassName={`${styles.pageStyle} ${styles.hoverStyle}`}
                previousLinkClassName={styles.prevNNextLink}
                nextLinkClassName={styles.prevNNextLink}
                disabledClassName={styles.disableLink}
              />
            )}
            {selectedDisplay === "Inactive Students" && (
              <ReactPaginate
                previousLabel={<i className="fa-solid fa-left-long"></i>}
                nextLabel={<i className="fa-solid fa-right-long"></i>}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(inactiveStudents.length / itemPerPage)}
                marginPagesDisplayed={3}
                pageRangeDisplayed={3}
                onPageChange={handlePageChange}
                containerClassName={styles.pageListArray}
                activeClassName={styles.currentPage}
                pageLinkClassName={`${styles.pageStyle} ${styles.hoverStyle}`}
                previousLinkClassName={styles.prevNNextLink}
                nextLinkClassName={styles.prevNNextLink}
                disabledClassName={styles.disableLink}
              />
            )}
          </div>
        </div>
        <div className={styles.blogListDisplay}>
          <h2>Latest Blogs</h2>
          <div className={styles.blogHolder}>
            {blogList.length > 0 && (
              <>
                {blogList
                  .filter((blog) => blog.author.role === "student")
                  .slice(0, 5)
                  .map((blog, index) => (
                    <div
                      className={styles.blogBox}
                      key={index}
                      onClick={() => console.log(`clicked ${blog.id}`)}
                    >
                      <div className={styles.tableImageHolder}>
                        <img
                          src={blog.author.profile_picture}
                          alt="profile-pic"
                        />
                      </div>
                      <div className={styles.blogInfoSection}>
                        <span>{blog.author.name}</span>
                        <span className={styles.hidableCol}>
                          {truncateText(blog.title, 40)}
                        </span>
                        <span className={styles.blogDate}>
                          {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
          <div className={styles.buttonHolder}>
            <div
              className={styles.underlineLink}
              onClick={() => navigate("./../blogs")}
            >
              View All
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorReport;
