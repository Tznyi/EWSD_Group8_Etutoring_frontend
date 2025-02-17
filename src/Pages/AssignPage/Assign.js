import { useState } from "react";
import { useStaff } from "../../Context/StaffContext";
import styles from "./Assign.module.css";
import ReactPaginate from "react-paginate";
import CenterBox from "../../Components/CenterBox/CenterBox";

function Assign() {
  const {
    studentList,
    tutorList,
    unassignedStudents,
    assignStudent,
    unassignStudent,
    isContextLoading,

    message,
    hasMessage,
    removeMessage,
  } = useStaff();

  const [currentPage, setCurrentPage] = useState(0);
  const itemPerPage = 10;
  const offset = currentPage * itemPerPage;
  const paginatedItems = studentList.slice(offset, offset + itemPerPage);

  const [assignFormOpen, setAssignFormOpen] = useState(false);

  const [selectedTutor, setSelectedTutor] = useState();
  const [selectedStudent, setSelectedStudent] = useState();

  const [studentInfo, setStudentInfo] = useState({});
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(false);

  function handlePageChange({ selected }) {
    setCurrentPage(selected);
  }

  function handleFormClose() {
    setAssignFormOpen(false);
    setSelectedStudent();
    setSelectedTutor();
  }

  async function handleAssign(e) {
    e.preventDefault();
    // window.alert(`${selectedTutor} ${selectedStudent}`);
    assignStudent(selectedTutor, selectedStudent);
    setAssignFormOpen(false);
  }

  function handleView(id) {
    setIsStudentDetailsOpen(true);
    setStudentInfo(studentList.find((student) => student.id === id));
  }

  function handleDetailClose() {
    setIsStudentDetailsOpen(false);
    setStudentInfo({});
  }

  function handleUnassign() {
    unassignStudent(studentInfo.id);
    setIsStudentDetailsOpen(false);
    setStudentInfo({});
  }

  return (
    <>
      <div className={styles.table_container}>
        <h2>Assign Student</h2>
        {isContextLoading ? (
          <h2>Loading...</h2>
        ) : (
          <table className={styles.styled_table}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Student Name</th>
                <th className={styles.hidableCol}>Tutor Name</th>
                <th>Status</th>
                <th className={styles.hidableCol}>
                  <button
                    className={styles.ass_button}
                    onClick={() => setAssignFormOpen(true)}
                  >
                    Asasign Student
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((student, index) => {
                let tutorName = "";
                let isAssigned = "Unassigned";
                if (student.tutor) {
                  tutorName = student.tutor.name;
                  isAssigned = "Assigned";
                }
                return (
                  <tr key={index} onClick={() => handleView(student.id)}>
                    <td>
                      {(currentPage + 1) * itemPerPage +
                        (index + 1) -
                        itemPerPage}
                    </td>
                    <td>{student.name}</td>
                    <td className={styles.hidableCol}>{tutorName}</td>
                    <td
                      className={`${
                        student.tutor ? styles.assigned : styles.unassigned
                      }`}
                    >
                      {isAssigned}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <div className={styles.pageNavHolder}>
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
        </div>
      </div>
      {/* ------------Alet Boxes------------ */}
      {assignFormOpen && (
        <CenterBox closeFun={() => handleFormClose()}>
          <form
            id="frmAssign"
            onSubmit={(e) => handleAssign(e)}
            className={styles.assignForm}
          >
            <h2>Assign Student Form</h2>
            <div className={styles.inputHolder}>
              <span>Select Tutor</span>
              <select
                id="tutorSelect"
                value={selectedTutor}
                onChange={(e) => {
                  setSelectedTutor(e.target.value);
                }}
                required
              >
                <option value="">--Tutor--</option>
                {tutorList.map((tutor, index) => {
                  if (tutor.students.length < 20) {
                    return (
                      <option value={tutor.id} key={index}>
                        {tutor.name}
                      </option>
                    );
                  } else {
                    return null;
                  }
                })}
              </select>
            </div>
            <div className={styles.inputHolder}>
              <span>Select Student</span>
              <select
                id="studentSelect"
                value={selectedStudent}
                onChange={(e) => {
                  setSelectedStudent(e.target.value);
                }}
                required
              >
                <option value="">--Student--</option>
                {unassignedStudents.map((student, index) => (
                  <option value={student.id} key={index}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              id="btnAssign"
              className={styles.assignButton}
            >
              Assign
            </button>
          </form>
        </CenterBox>
      )}
      {hasMessage && (
        <CenterBox closeFun={() => removeMessage()}>
          <h2>{message}</h2>
        </CenterBox>
      )}

      {isStudentDetailsOpen && (
        <CenterBox closeFun={() => handleDetailClose()}>
          <div className={styles.infoPic}>
            <img src={studentInfo.profile_picture} alt="profile_picture" />
          </div>
          <div>Name: {studentInfo.name}</div>
          {studentInfo.tutor && <div>Tutor: {studentInfo.tutor.name}</div>}
          <div>Email: {studentInfo.email}</div>
          {studentInfo.tutor && (
            <button
              id="btnAssign"
              className={styles.unassignButton}
              onClick={() => handleUnassign()}
            >
              Unassign
            </button>
          )}
        </CenterBox>
      )}
    </>
  );
}

export default Assign;
