import { useEffect, useState } from "react";
import AddButton from "../../../Components/AddButton/AddButton";
import styles from "./TutorMeeting.module.css";
import ReactPaginate from "react-paginate";
import { useMeeting } from "../../../Context/MeetingContext";
import { useTutor } from "../../../Context/TutorContext";
import { useNavigate } from "react-router";
import CenterBox from "../../../Components/CenterBox/CenterBox";

function TutorMeeting() {
  const { meetingList, deleteMeeting, hasMessage, message, removeMessage } =
    useMeeting();
  const { assignedStudents } = useTutor();

  const [selectedStudent, setSelectedStudent] = useState();
  const [searchList, setSearchList] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState();

  const [paginatedItems, setPaginatedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemPerPage = 5;
  const offset = currentPage * itemPerPage;

  useEffect(() => {
    if (isSearch) {
      setPaginatedItems(searchList.slice(offset, offset + itemPerPage));
    } else {
      setPaginatedItems(meetingList.slice(offset, offset + itemPerPage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingList, offset]);

  const navigate = useNavigate();

  function handlePageChange({ selected }) {
    setCurrentPage(selected);
  }

  function formatTime24to12(timeStr) {
    // eslint-disable-next-line no-unused-vars
    let [hours, minutes, seconds] = timeStr.split(":").map(Number);

    let period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  function handleFilter(e) {
    if (e.target.value) {
      setSelectedStudent(e.target.value);
      setCurrentPage(0);
      setSearchList(
        meetingList.filter(
          (meeting) => meeting.student_id === parseInt(e.target.value)
        )
      );
      setPaginatedItems(
        meetingList
          .filter((meeting) => meeting.student_id === parseInt(e.target.value))
          .slice(offset, offset + itemPerPage)
      );
      setIsSearch(true);
    } else {
      setSelectedStudent();
      setCurrentPage(0);
      setPaginatedItems(meetingList.slice(offset, offset + itemPerPage));
      setSearchList([]);
      setIsSearch(false);
    }
  }

  function handleViewDetail(e, id) {
    if (e.target.id === "link") {
      return;
    }
    navigate("./../viewmeeting", {
      state: { id: id },
    });
  }

  function deleteSelect(id) {
    setSelectedMeeting(id);
    setIsDeleteOpen(true);
  }

  function handleDelete() {
    deleteMeeting(selectedMeeting);
    setIsDeleteOpen(false);
  }

  return (
    <>
      <div className={styles.mainFrame}>
        <h2 className={styles.header}>Meeting List</h2>
        <div className={styles.banner}>
          <div className={styles.filterSection}>
            <div className={styles.filterInputHolder}>
              <span>Filter by Student</span>
              <select value={selectedStudent} onChange={(e) => handleFilter(e)}>
                <option value="">-- All Students --</option>
                {assignedStudents.map((student, index) => (
                  <option key={index} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <AddButton onClick={() => navigate("./../createmeeting")}>
              Create Meeting
            </AddButton>
          </div>
        </div>
        <div className={styles.tableDisplaySection}>
          <div className={styles.tableHolder}>
            {paginatedItems.length < 1 ? (
              <div className={styles.notFound}>Found No Meeting!</div>
            ) : (
              <table className={styles.styled_table}>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th className={styles.hidableCol}>Title</th>
                    <th>Student</th>
                    <th className={styles.hidableCol}>Status</th>
                    <th>Meeting Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((meeting, index) => {
                    const date = new Date(meeting.date).toLocaleDateString();
                    const time = formatTime24to12(meeting.time);
                    return (
                      <tr
                        key={index}
                        onClick={(e) => handleViewDetail(e, meeting.id)}
                      >
                        <td>{`${date} ${time}`}</td>
                        <td className={styles.hidableCol}>{meeting.title}</td>
                        <td>{meeting.student.name}</td>
                        {meeting.status === "confirmed" && (
                          <td
                            className={`${styles.hidableCol} ${styles.confirmed}`}
                          >
                            <i className="fa-solid fa-circle-check"></i>
                            <span>{meeting.status}</span>
                          </td>
                        )}
                        {meeting.status === "pending" && (
                          <td
                            className={`${styles.hidableCol} ${styles.pending}`}
                          >
                            <i className="fa-solid fa-clock"></i>
                            <span>{meeting.status}</span>
                          </td>
                        )}
                        {meeting.status === "cancelled" && (
                          <td
                            className={`${styles.hidableCol} ${styles.cancelled}`}
                          >
                            <i className="fa-solid fa-circle-xmark"></i>
                            <span>{meeting.status}</span>
                          </td>
                        )}
                        <td>
                          {meeting.type === "virtual" &&
                          meeting.meeting_link ? (
                            <a
                              href={meeting.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              id="link"
                            >
                              Join
                              <i className="fa-solid fa-video" id="link"></i>
                            </a>
                          ) : (
                            <span></span>
                          )}
                        </td>
                        <td className={styles.tableActionField}>
                          <span
                            id="link"
                            onClick={() =>
                              navigate("./../editmeeting", {
                                state: { id: meeting.id },
                              })
                            }
                          >
                            Edit{" "}
                            <i
                              className="fa-solid fa-pen-to-square"
                              id="link"
                            ></i>
                          </span>
                          <span
                            id="link"
                            onClick={() => deleteSelect(meeting.id)}
                          >
                            Delete{" "}
                            <i className="fa-solid fa-trash" id="link"></i>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          {!isSearch ? (
            <div className={styles.pageNavHolder}>
              <ReactPaginate
                previousLabel={<i className="fa-solid fa-left-long"></i>}
                nextLabel={<i className="fa-solid fa-right-long"></i>}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(meetingList.length / itemPerPage)}
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
            </div>
          ) : (
            <div className={styles.pageNavHolder}>
              <ReactPaginate
                previousLabel={<i className="fa-solid fa-left-long"></i>}
                nextLabel={<i className="fa-solid fa-right-long"></i>}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(searchList.length / itemPerPage)}
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
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------------- */}

      {isDeleteOpen && (
        <CenterBox closeFun={() => setIsDeleteOpen(false)}>
          <div className={styles.deleteForm}>
            <span>Are you sure you want to delete this meeting?</span>
            <div className={styles.btnHolder}>
              <div
                className={styles.filterButton}
                onClick={() => handleDelete()}
              >
                Delete
              </div>
            </div>
          </div>
        </CenterBox>
      )}

      {hasMessage && (
        <CenterBox closeFun={() => removeMessage()}>{message}</CenterBox>
      )}
    </>
  );
}

export default TutorMeeting;
