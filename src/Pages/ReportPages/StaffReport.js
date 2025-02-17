import { useEffect, useState } from "react";
import styles from "./Report.module.css";
import ReactPaginate from "react-paginate";
import { useStaff } from "../../Context/StaffContext";

// temp data

const blogList = [
  {
    name: "Alice Johnson",
    title: "STEM Education Enthusiast",
    date: "2025-02-10",
  },
  {
    name: "Bob Smith",
    title: "EdTech Innovator",
    date: "2025-02-11",
  },
  {
    name: "Charlie Brown",
    title: "Curriculum Developer",
    date: "2025-02-09",
  },
  {
    name: "David Wilson",
    title: "Online Learning Strategist",
    date: "2025-02-12",
  },
  {
    name: "Emily Davis",
    title: "Education Policy Analyst",
    date: "2025-02-08",
  },
];

function StaffReport() {
  const [selectedDisplay, setSelectedDisplay] = useState("Tutor List");
  const [displayList, setDisplayList] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemPerPage = 5;
  const offset = currentPage * itemPerPage;
  const paginatedItems = displayList.slice(offset, offset + itemPerPage);

  const { tutorList, studentList, assignedStudents, unassignedStudents } =
    useStaff();

  useEffect(() => {
    setDisplayList(tutorList);
    setSelectedDisplay("Tutor List");
  }, [tutorList]);

  useEffect(() => {
    setCurrentPage(0);
  }, [displayList]);

  function handleTutorList() {
    setSelectedDisplay("Tutor List");
    setDisplayList(tutorList);
  }

  function handleStudentList() {
    setSelectedDisplay("Student List");
    setDisplayList(studentList);
  }

  function handleAssignedStudent() {
    setSelectedDisplay("Assigned Students");
    setDisplayList(assignedStudents);
  }

  function handleUnassignedStudent() {
    setSelectedDisplay("Unassigned Students");
    setDisplayList(unassignedStudents);
  }

  function handlePageChange({ selected }) {
    setCurrentPage(selected);
  }

  return (
    <div className={styles.reportLayout}>
      <div className={styles.selectionGrid}>
        {/* ------ Tutor ----- */}
        <div className={styles.selectionBox} onClick={() => handleTutorList()}>
          <i className="fa-solid fa-user-group"></i>
          <div className={styles.boxInfoSection}>
            <h3>Tutors</h3>
            <h4>
              <span className={styles.coloredText}>{tutorList.length}</span>
            </h4>
          </div>
        </div>
        {/* ----- Student ----- */}
        <div
          className={styles.selectionBox}
          onClick={() => handleStudentList()}
        >
          <i className="fa-solid fa-user-group"></i>
          <div className={styles.boxInfoSection}>
            <h3>Students</h3>
            <h4>
              <span className={styles.coloredText}>{studentList.length}</span>
            </h4>
          </div>
        </div>
        {/* ----- Assigned Student ----- */}
        <div
          className={styles.selectionBox}
          onClick={() => handleAssignedStudent()}
        >
          <i className="fa-solid fa-user-group"></i>
          <div className={styles.boxInfoSection}>
            <h3>Assigned Students</h3>
            <h4>
              <span className={styles.coloredText}>
                {assignedStudents.length}
              </span>
              /{studentList.length}
            </h4>
          </div>
        </div>
        {/* ----- Unassigned Student ----- */}
        <div
          className={styles.selectionBox}
          onClick={() => handleUnassignedStudent()}
        >
          <i className="fa-solid fa-user-group"></i>
          <div className={styles.boxInfoSection}>
            <h3>Unassigned Students</h3>
            <h4>
              <span className={styles.coloredText}>
                {unassignedStudents.length}
              </span>
              /{studentList.length}
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
                        {/* <td>2/2/2025</td> */}
                        <td>
                          <span className={styles.link}>Something?</span>
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
          <div className={styles.pageNavHolder} id={currentPage}>
            {selectedDisplay === "Tutor List" && (
              <ReactPaginate
                previousLabel={<i className="fa-solid fa-left-long"></i>}
                nextLabel={<i className="fa-solid fa-right-long"></i>}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(tutorList.length / itemPerPage)}
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
            {selectedDisplay === "Student List" && (
              <ReactPaginate
                previousLabel={<i className="fa-solid fa-left-long"></i>}
                nextLabel={<i className="fa-solid fa-right-long"></i>}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(studentList.length / itemPerPage)}
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
            {selectedDisplay === "Unassigned Students" && (
              <ReactPaginate
                previousLabel={<i className="fa-solid fa-left-long"></i>}
                nextLabel={<i className="fa-solid fa-right-long"></i>}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(unassignedStudents.length / itemPerPage)}
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
            {blogList.map((blog, index) => (
              <div className={styles.blogBox} key={index}>
                <div className={styles.tableImageHolder}>
                  <img src="/profile-pic.png" alt="profile-pic" />
                </div>
                <div className={styles.blogInfoSection}>
                  <span>{blog.name}</span>
                  <span className={styles.hidableCol}>{blog.title}</span>
                  <span className={styles.blogDate}>{blog.date}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.buttonHolder}>
            <div className={styles.underlineLink}>View All</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffReport;
