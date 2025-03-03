import { useEffect, useState } from "react";
import styles from "./StaffMeeting.module.css";
import ReactPaginate from "react-paginate";
import { useMeeting } from "../../../Context/MeetingContext";
import { useStaff } from "../../../Context/StaffContext";
import CenterBox from "../../../Components/CenterBox/CenterBox";
import SearchBox from "../../../Components/SearchBox/SearchBox";
import { useNavigate } from "react-router";

function StaffMeeting() {
  const { meetingList } = useMeeting();
  const { tutorList, assignedStudents } = useStaff();

  const [selectedStudent, setSelectedStudent] = useState({});
  const [selectedTutor, setSelectedTutor] = useState({});
  const [searchList, setSearchList] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [filterList, setFilterList] = useState([]);
  const [isTutorSelectOpen, setIsTutorSelectOpen] = useState(false);
  const [isStudentSelectOpen, setIsStudentSelectOpen] = useState(false);

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

  function handleSearchPageChange({ selected }) {
    setCurrentPage(selected);
  }

  function formatTime24to12(timeStr) {
    // eslint-disable-next-line no-unused-vars
    let [hours, minutes, seconds] = timeStr.split(":").map(Number);

    let period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  function searchBoxClose() {
    setIsTutorSelectOpen(false);
    setIsStudentSelectOpen(false);
    setSearchKey("");
    setFilterList([]);
  }

  function handleSearch() {
    if (isStudentSelectOpen) {
      setFilterList(
        assignedStudents.filter((student) =>
          student.name
            .replace(/\s/g, "")
            .toLowerCase()
            .includes(searchKey.replace(/\s/g, "").toLowerCase())
        )
      );
    } else {
      setFilterList(
        tutorList.filter((tutor) =>
          tutor.name
            .replace(/\s/g, "")
            .toLowerCase()
            .includes(searchKey.replace(/\s/g, "").toLowerCase())
        )
      );
    }
  }

  function handleSearchSelect(id) {
    if (isStudentSelectOpen) {
      setSelectedStudent(
        assignedStudents.find((student) => student.id === parseInt(id))
      );
    } else {
      setSelectedTutor(tutorList.find((tutor) => tutor.id === parseInt(id)));
    }
    setIsTutorSelectOpen(false);
    setIsStudentSelectOpen(false);
    setSearchKey("");
    setFilterList([]);
  }

  function handleClearFilter() {
    setSelectedStudent({});
    setSelectedTutor({});
    setCurrentPage(0);
    setPaginatedItems(meetingList.slice(offset, offset + itemPerPage));
    setSearchList([]);
    setIsSearch(false);
  }

  function handleFilter() {
    setIsSearch(true);
    setCurrentPage(0);
    const filteredList = meetingList.filter(
      (meeting) =>
        // eslint-disable-next-line eqeqeq
        (!selectedStudent.id || meeting.student_id == selectedStudent.id) &&
        // eslint-disable-next-line eqeqeq
        (!selectedTutor.id || meeting.tutor_id == selectedTutor.id)
    );
    setSearchList(filteredList);
    setPaginatedItems(filteredList.slice(offset, offset + itemPerPage));
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
          {/* Filter tutor */}
          <div className={styles.filterSection}>
            <div className={styles.filterInputHolder}>
              <span>Filter by Tutor</span>
              <div
                className={styles.filterBoxStyle}
                onClick={() => setIsTutorSelectOpen(true)}
              >
                <span>{`${
                  selectedTutor.name ? selectedTutor.name : "Any Tutor"
                }`}</span>
                <i className="fa-solid fa-user-tie"></i>
              </div>
            </div>
          </div>
          {/* Filter student */}
          <div className={styles.filterSection}>
            <div className={styles.filterInputHolder}>
              <span>Filter by Student</span>
              <div
                className={styles.filterBoxStyle}
                onClick={() => setIsStudentSelectOpen(true)}
              >
                <span>{`${
                  selectedStudent.name ? selectedStudent.name : "Any Student"
                }`}</span>
                <i className="fa-solid fa-user"></i>
              </div>
            </div>
            <div className={styles.bannerBtnHolder}>
              <div
                onClick={() => handleFilter()}
                className={styles.filterButton}
              >
                Filter
              </div>
              <div
                onClick={() => handleClearFilter()}
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
                    <th>Student</th>
                    <th>Tutor</th>
                    <th className={styles.hidableCol}>Meeting Type</th>
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
                        <td>{meeting.student.name}</td>
                        <td>{meeting.tutor.name}</td>
                        <td className={styles.hidableCol}>{meeting.type}</td>
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
                onPageChange={handleSearchPageChange}
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

      {/* --------------------------------- */}

      {(isStudentSelectOpen || isTutorSelectOpen) && (
        <CenterBox closeFun={() => searchBoxClose()}>
          <div className={styles.searchForm}>
            <h2>{`${
              isStudentSelectOpen ? "Student" : "Tutor"
            } Search Form`}</h2>
            <SearchBox
              color="#f0f0f0"
              placeHolder={isStudentSelectOpen ? "Student" : "Tutor"}
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onSubmit={() => handleSearch()}
              focused={true}
            />
            {filterList.length < 1 ? (
              <div className={styles.notFoundSearch}>No Matching Result!</div>
            ) : (
              <div className={styles.filterListHolder}>
                <table className={styles.styled_table}>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Student</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterList.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          onClick={() => handleSearchSelect(item.id)}
                        >
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CenterBox>
      )}
    </>
  );
}

export default StaffMeeting;
