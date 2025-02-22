import { useEffect, useState } from "react";
import AddButton from "../../../Components/AddButton/AddButton";
import styles from "./StudentMeeting.module.css";
import ReactPaginate from "react-paginate";
import { useMeeting } from "../../../Context/MeetingContext";
import { useNavigate } from "react-router";

function StudentMeeting() {
  const { meetingList } = useMeeting();

  const [selectedDate, setSelectedDate] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  const [paginatedItems, setPaginatedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemPerPage = 5;
  const offset = currentPage * itemPerPage;

  const navigate = useNavigate();

  useEffect(() => {
    if (isSearch) {
      setPaginatedItems(searchList.slice(offset, offset + itemPerPage));
    } else {
      setPaginatedItems(meetingList.slice(offset, offset + itemPerPage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingList, offset]);

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

  function handleFilter() {
    setCurrentPage(0);
    const filteredItem = meetingList.filter(
      (meeting) =>
        new Date(meeting.date).toLocaleDateString() ===
        new Date(selectedDate).toLocaleDateString()
    );

    setSearchList(filteredItem);
    setPaginatedItems(filteredItem.slice(offset, offset + itemPerPage));

    setIsSearch(true);
  }

  function cancelFilter() {
    setSelectedDate("");
    setCurrentPage(0);
    setPaginatedItems(meetingList.slice(offset, offset + itemPerPage));
    setSearchList([]);
    setIsSearch(false);
  }

  function handleViewDetail(e, id) {
    if (e.target.id === "link") {
      return;
    }
    navigate("./../viewmeeting", {
      state: { id: id },
    });
  }

  return (
    <>
      <div className={styles.mainFrame}>
        <h2 className={styles.header}>Meeting List</h2>
        <div className={styles.banner}>
          <div className={styles.createBtnSection}>
            <AddButton onClick={() => navigate("./../request")}>
              Request Meeting
            </AddButton>
          </div>
          <div className={styles.filterSection}>
            <div className={styles.filterInputHolder}>
              <span>Filter by Date</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className={styles.bannerBtnHolder}>
              <div
                onClick={() => handleFilter()}
                className={styles.filterButton}
              >
                Filter
              </div>
              <div
                onClick={() => cancelFilter()}
                className={styles.filterCancelButton}
              >
                Clear Filter
              </div>
            </div>
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
                    <th className={styles.hidableCol}>Tutor</th>
                    <th>Status</th>
                    <th>Meeting Link</th>
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
                        <td>{`${date} _ ${time}`}</td>
                        <td className={styles.hidableCol}>{meeting.title}</td>
                        <td className={styles.hidableCol}>
                          {meeting.tutor.name}
                        </td>
                        <td>{meeting.status}</td>
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
    </>
  );
}

export default StudentMeeting;
