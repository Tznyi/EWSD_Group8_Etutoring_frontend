import { useEffect, useState } from "react";
import styles from "./Report.module.css";
import ReactPaginate from "react-paginate";
import { useStaff } from "../../Context/StaffContext";
import { useLocation, useNavigate } from "react-router";
import { useBlog } from "../../Context/BlogContext";
import { useUser } from "../../Context/UserContext";
import CenterBox from "../../Components/CenterBox/CenterBox";
import { Mail, Mails } from "lucide-react";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.defaults.color = "white";

// temp data

function StaffReport() {
  const [selectedDisplay, setSelectedDisplay] = useState("Tutor List");
  const [displayList, setDisplayList] = useState([]);
  const [serverMessage, setServerMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemPerPage = 5;
  const offset = currentPage * itemPerPage;
  const paginatedItems = displayList.slice(offset, offset + itemPerPage);

  const {
    tutorList,
    studentList,
    assignedStudents,
    unassignedStudents,
    inactiveStudents,
    fetchAverageMessage,
    averageMessage,
    fetchMessageIn7Days,
    messageIn7Days,
    fetchMostUsedBrowsers,
    mostUsedBrowsers,
  } = useStaff();
  const { blogList, clearSelect } = useBlog();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { token } = useUser();

  console.log(mostUsedBrowsers);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setDisplayList(tutorList);
    setSelectedDisplay("Tutor List");
  }, [tutorList]);

  useEffect(() => {
    clearSelect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [displayList]);

  useEffect(() => {
    fetchAverageMessage();
    fetchMessageIn7Days();
    fetchMostUsedBrowsers();
  }, [fetchAverageMessage, fetchMessageIn7Days, fetchMostUsedBrowsers]);

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

  function handleInactiveStudent() {
    setSelectedDisplay("Inactive Students");
    setDisplayList(inactiveStudents);
  }

  function handlePageChange({ selected }) {
    setCurrentPage(selected);
  }

  function handleViewDetails(id, role) {
    if (role === "tutor") {
      navigate("./../tutorDetails", { state: { id: id } });
    } else {
      navigate("./../studentdetails", { state: { id: id } });
    }
  }

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;

    let trimmedText = text.substring(0, maxLength);
    return trimmedText.substring(0, trimmedText.lastIndexOf(" ")) + "...";
  }

  // donut chart

  function setDonut() {
    const data = {
      labels: mostUsedBrowsers.map((browser) => browser.browser),
      datasets: [
        {
          label: "Total Users",
          data: mostUsedBrowsers.map((browser) => browser.count),
          backgroundColor: [
            "rgb(255, 229, 99)", // Warm yellow
            "rgb(124, 204, 122)", // Soft green
            "rgb(231, 124, 75)", // Peachy coral
            "rgb(219, 64, 64)", // Rich red
            "rgb(140, 204, 183)", // Muted teal
            "rgb(255, 180, 90)", // Golden apricot
            "rgb(90, 180, 110)", // Earthy green
            "rgb(240, 100, 70)", // Warm sunset
            "rgb(220, 70, 90)", // Bold cherry
            "rgb(255, 220, 130)", // Light sunflower
            "rgb(160, 190, 120)", // Soft olive
            "rgb(245, 145, 110)", // Soft salmon
            "rgb(200, 160, 230)", // Soft lavender
            "rgb(255, 155, 80)", // Orange-tinted peach
            "rgb(120, 180, 220)", // Light sky blue
          ],
          hoverOffset: 4,
        },
      ],
    };

    return data;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  async function handleSendMail() {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      var requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };

      const res = await fetch(
        "http://127.0.0.1:8000/api/reports/send-emails/inactive-students",
        requestOptions
      );

      const data = await res.json();
      setServerMessage(data.message);
    } catch {
      console.log("error while sending mail");
    }
  }

  return (
    <>
      <div className={styles.reportLayout}>
        <div className={styles.selectionGrid}>
          {/* ------ Tutor ----- */}
          <div
            className={styles.selectionBox}
            onClick={() => handleTutorList()}
          >
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
          {/* ----- Inactive Student ----- */}
          <div
            className={styles.selectionBox}
            onClick={() => handleInactiveStudent()}
          >
            <i className="fa-solid fa-user-group"></i>
            <div className={styles.boxInfoSection}>
              <h3>Inactive Students</h3>
              <h4>
                <span className={styles.coloredText}>
                  {inactiveStudents.length}
                </span>
                /{studentList.length}
              </h4>
            </div>
          </div>
        </div>
        <div className={styles.reportDisplay}>
          <div className={styles.tableDisplay}>
            <div className={styles.tableTitle}>
              <h3>{selectedDisplay}</h3>
              {selectedDisplay === "Inactive Students" && (
                <div
                  className={styles.sendMailBtn}
                  onClick={() => handleSendMail()}
                >
                  Send Mail
                </div>
              )}
            </div>
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
                      let newDate = "Inactive";

                      if (student.last_active_at) {
                        newDate = new Date(
                          student.last_active_at
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
                            <span
                              className={styles.link}
                              onClick={() =>
                                handleViewDetails(student.id, student.role)
                              }
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
              {blogList.slice(0, 5).map((blog, index) => (
                <div
                  className={styles.blogBox}
                  key={index}
                  onClick={() =>
                    navigate("./../blogdetails", { state: { id: blog.id } })
                  }
                >
                  <div className={styles.tableImageHolder}>
                    <img src={blog.author.profile_picture} alt="profile-pic" />
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
        <div className={styles.reportDisplay}>
          <div className={styles.messageReports}>
            <div className={styles.messageCard}>
              <Mail />
              Tutors' Average Message Count:
              <span>{averageMessage}</span>
            </div>
            <div className={styles.messageCard}>
              <Mails />
              Number of messages in the last 7 days:
              <span>{messageIn7Days}</span>
            </div>
          </div>
          <div className={styles.doughnutHolder}>
            <Doughnut data={setDonut()} options={options} />
          </div>
        </div>
      </div>

      {/* ------------------------------ */}

      {serverMessage.trim() !== "" && (
        <CenterBox closeFun={() => setServerMessage("")}>
          {serverMessage}
        </CenterBox>
      )}
    </>
  );
}

export default StaffReport;
