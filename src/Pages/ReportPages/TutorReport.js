import { useEffect, useState } from "react";
import { useTutor } from "../../Context/TutorContext";
import styles from "./Report.module.css";
import ReactPaginate from "react-paginate";

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

function TutorReport() {
  const [selectedDisplay, setSelectedDisplay] = useState("Assigned Students");
  const [displayList, setDisplayList] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemPerPage = 5;
  const offset = currentPage * itemPerPage;
  const paginatedItems = displayList.slice(offset, offset + itemPerPage);

  const { assignedStudents, inactiveStudents } = useTutor();

  useEffect(() => {
    setDisplayList(assignedStudents);
  }, [assignedStudents]);

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
            <table className={styles.tableStyle}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th className={styles.hidableCol}>Picture</th>
                  <th>Name</th>
                  <th className={styles.hidableCol}>Email</th>
                  <th className={styles.hidableCol}>Phone No</th>
                  <th>Last Seen</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((student, index) => (
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
                        <img src="/profile-pic.png" alt="profile-pic" />
                      </div>
                    </td>
                    <td>{student.name}</td>
                    <td className={styles.hidableCol}>{student.email}</td>
                    <td className={styles.hidableCol}>{student.phoneNo}</td>
                    <td>1 day</td>
                    <td>
                      <span className={styles.link}>Something?</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.pageNavHolder}>
            <ReactPaginate
              previousLabel={<i className="fa-solid fa-left-long"></i>}
              nextLabel={<i className="fa-solid fa-right-long"></i>}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={Math.ceil(displayList.length / itemPerPage)}
              marginPagesDisplayed={5}
              pageRangeDisplayed={2}
              onPageChange={handlePageChange}
              containerClassName={styles.pageListArray}
              activeClassName={styles.currentPage}
              pageLinkClassName={`${styles.pageStyle} ${styles.hoverStyle}`}
              previousLinkClassName={styles.prevNNextLink}
              nextLinkClassName={styles.prevNNextLink}
              disabledClassName={styles.disableLink}
            />
          </div>
        </div>
        <div className={styles.blogListDisplay}>
          <h2>Latest Blogs</h2>
          <div className={styles.blogHolder}>
            {blogList.map((blog) => (
              <div className={styles.blogBox}>
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

export default TutorReport;
