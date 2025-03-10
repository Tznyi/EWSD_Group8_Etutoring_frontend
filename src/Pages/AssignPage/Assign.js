import { useEffect, useState } from "react";
import { useStaff } from "../../Context/StaffContext";
import styles from "./Assign.module.css";
import ReactPaginate from "react-paginate";
import CenterBox from "../../Components/CenterBox/CenterBox";
import { useLocation } from "react-router";

function Assign() {
  const {
    studentList,
    tutorList,
    assignedStudents,
    unassignedStudents,
    assignStudent,
    unassignStudent,
    isContextLoading,
    bulkAssign,

    message,
    hasMessage,
    removeMessage,
  } = useStaff();

  const [displayList, setDisplayList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemPerPage = 10;
  const offset = currentPage * itemPerPage;
  const paginatedItems = displayList.slice(offset, offset + itemPerPage);

  const [assignFormOpen, setAssignFormOpen] = useState(false);
  const [bulkAssignFormOpen, setBulkAssignFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isBulkAssign, setIsBulkAssign] = useState(false);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);
  const [isAssignConfirmOpen, setIsAssignConfirmOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [selectedTutor, setSelectedTutor] = useState();
  const [selectedStudent, setSelectedStudent] = useState();
  const [selectedStudentArray, setSelectedStudentArray] = useState([]);
  const [filterType, setFilterType] = useState("All Students");

  const [studentInfo, setStudentInfo] = useState({});
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(false);

  // reset scroll

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setDisplayList(studentList);
  }, [studentList]);

  function handlePageChange({ selected }) {
    setCurrentPage(selected);
  }

  function handleFormClose() {
    setAssignFormOpen(false);
    setBulkAssignFormOpen(false);
    setSelectedStudent();
    setSelectedTutor();
  }

  function handleAssign(e) {
    e.preventDefault();
    setAssignFormOpen(false);
    setIsAssignConfirmOpen(true);
  }

  function confirmAssign() {
    assignStudent(selectedTutor, selectedStudent);
    setIsAssignConfirmOpen(false);
    setSelectedStudent();
    setSelectedTutor();
  }

  function handleView(id) {
    if (isBulkAssign) {
      if (selectedStudentArray.filter((st) => st === id).length === 0) {
        if (
          selectedStudentArray.length >=
          20 -
            tutorList.find((tutor) => tutor.id === parseInt(selectedTutor))
              .students.length
        ) {
          setIsAlertOpen(true);
          setAlertMessage(
            `Maximum number of selected student has been reached.`
          );
          return;
        }
        setSelectedStudentArray((curArray) => [...curArray, id]);
      } else {
        setSelectedStudentArray((curArray) =>
          curArray.filter((item) => item !== id)
        );
      }
    } else {
      setIsStudentDetailsOpen(true);
      setStudentInfo(studentList.find((student) => student.id === id));
    }
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

  function setAlert(message) {
    setIsAlertOpen(true);
    setAlertMessage(message);
  }

  function handleFilter(e) {
    setFilterType(e.target.value);
    if (e.target.value === "All Students") {
      setDisplayList(studentList);
    }
    if (e.target.value === "Assigned Students") {
      setDisplayList(assignedStudents);
    }
    if (e.target.value === "Unassigned Students") {
      setDisplayList(unassignedStudents);
    }
    setCurrentPage(0);
  }

  // --------------------------

  function handleBulkAssign(e) {
    e.preventDefault();
    setIsBulkAssign(true);
    setBulkAssignFormOpen(false);
  }

  function handleBulkSubmit() {
    setIsBulkConfirmOpen(true);
  }

  function handleBulkCancel(e) {
    e.preventDefault();
    setIsBulkConfirmOpen(false);
    setIsBulkAssign(false);
    setSelectedStudentArray([]);
    setSelectedTutor();
  }

  function handleBulkAllocate(e) {
    e.preventDefault();
    bulkAssign(selectedTutor, selectedStudentArray);
    setIsBulkConfirmOpen(false);
    setIsBulkAssign(false);
    setSelectedStudentArray([]);
    setSelectedTutor();
  }

  return (
    <>
      <div className={styles.table_container}>
        <h2>Assign Student</h2>
        {isContextLoading ? (
          <h2>Loading...</h2>
        ) : (
          <>
            <div className={styles.buttonHolder}>
              {isBulkAssign ? (
                <>
                  <button
                    className={`${styles.ass_button} ${styles.disabled}`}
                    onClick={() =>
                      setAlert("Please finish or cancel bulk assign first!")
                    }
                  >
                    Assign Student
                  </button>
                  <button
                    className={styles.bulk_button}
                    onClick={() => handleBulkSubmit()}
                  >
                    <span>{`Assign ${selectedStudentArray.length} / ${
                      20 -
                      tutorList.find(
                        (tutor) => tutor.id === parseInt(selectedTutor)
                      ).students.length
                    } `}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.ass_button}
                    onClick={() => setAssignFormOpen(true)}
                  >
                    Assign Student
                  </button>
                  <button
                    className={styles.ass_button}
                    onClick={() => setBulkAssignFormOpen(true)}
                  >
                    Bulk Assign
                  </button>
                </>
              )}
            </div>
            <table className={styles.styled_table}>
              <thead>
                <tr>
                  <th colSpan={6}>
                    <div className={styles.tableFilter}>
                      <span>Filter</span>
                      <select
                        value={filterType}
                        onChange={(e) => handleFilter(e)}
                      >
                        <option value={"All Students"}>All Students</option>
                        <option value={"Assigned Students"}>
                          Assigned Students
                        </option>
                        <option value={"Unassigned Students"}>
                          Unassigned Students
                        </option>
                      </select>
                    </div>
                  </th>
                </tr>
                <tr>
                  {isBulkAssign && <th>Select</th>}
                  <th>No.</th>
                  <th>Student Name</th>
                  <th className={styles.hidableCol}>Email</th>
                  <th className={styles.hidableCol}>Tutor Name</th>
                  <th>Status</th>
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
                      {isBulkAssign && (
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedStudentArray.includes(student.id)}
                            onChange={() => handleView(student.id)}
                          />
                        </td>
                      )}
                      <td>
                        {(currentPage + 1) * itemPerPage +
                          (index + 1) -
                          itemPerPage}
                      </td>
                      <td>{student.name}</td>
                      <td className={styles.hidableCol}>{student.email}</td>
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
          </>
        )}
        {filterType === "All Students" && (
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
        )}
        {filterType === "Assigned Students" && (
          <div className={styles.pageNavHolder}>
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
          </div>
        )}
        {filterType === "Unassigned Students" && (
          <div className={styles.pageNavHolder}>
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
          </div>
        )}
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
                {studentList.map((student, index) => (
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

      {bulkAssignFormOpen && (
        <CenterBox closeFun={() => handleFormClose()}>
          <form
            id="frmAssign"
            onSubmit={(e) => handleBulkAssign(e)}
            className={styles.assignForm}
          >
            <h2>Bulk Assign Form</h2>
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
          <h3>{message}</h3>
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

      {isAlertOpen && (
        <CenterBox closeFun={() => setIsAlertOpen(false)}>
          {alertMessage}
        </CenterBox>
      )}

      {isBulkConfirmOpen && (
        <CenterBox closeFun={() => setIsBulkConfirmOpen(false)}>
          <form
            id="frmAssign"
            onSubmit={(e) => handleBulkAllocate(e)}
            className={styles.bulkForm}
          >
            <h2>Bulk Assign Details</h2>
            <div className={styles.inputHolder}>
              <span>Select Tutor:</span>
              <span className={styles.bulkData}>
                {
                  tutorList.find(
                    (tutor) => tutor.id === parseInt(selectedTutor)
                  ).name
                }
              </span>
            </div>
            <div className={styles.inputHolder}>
              <span>Select Students:</span>
              <div className={styles.listHolder}>
                {selectedStudentArray.length < 1 ? (
                  <div className={styles.notFound}>No Student Selected!</div>
                ) : (
                  <ol className={`${styles.bulkData} ${styles.bulkStuList} `}>
                    {selectedStudentArray.map((stuId, index) => {
                      const student = studentList.find(
                        (stud) => stud.id === stuId
                      );

                      return (
                        <li key={index}>
                          {student.name}{" "}
                          {student.tutor && (
                            <span
                              className={`${styles.tutorDisplay} ${
                                student.tutor.id === parseInt(selectedTutor)
                                  ? styles.isSame
                                  : styles.isDifferent
                              }`}
                            >
                              ({student.tutor.name})
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            </div>
            <div className={styles.formBtnHolder}>
              <button
                type="submit"
                id="btnAssign"
                className={styles.assignButton}
              >
                Assign
              </button>
              <button
                id="btnCancel"
                className={styles.cancelButton}
                onClick={(e) => handleBulkCancel(e)}
              >
                Cancel
              </button>
            </div>
          </form>
        </CenterBox>
      )}

      {isAssignConfirmOpen && (
        <CenterBox closeFun={() => setIsAssignConfirmOpen(false)}>
          <div className={styles.bulkForm}>
            <h2>Assign Confirmation</h2>
            {studentList.find(
              (student) => student.id === parseInt(selectedStudent)
            ).tutor ? (
              <>
                {studentList.find(
                  (student) => student.id === parseInt(selectedStudent)
                ).tutor.id === parseInt(selectedTutor) ? (
                  <span>
                    {
                      studentList.find(
                        (student) => student.id === parseInt(selectedStudent)
                      ).name
                    }{" "}
                    has already been assigned to{" "}
                    {
                      studentList.find(
                        (student) => student.id === parseInt(selectedStudent)
                      ).tutor.name
                    }
                  </span>
                ) : (
                  <span>
                    Are you sure you want to reallocate{" "}
                    {
                      studentList.find(
                        (student) => student.id === parseInt(selectedStudent)
                      ).name
                    }{" "}
                    from{" "}
                    {
                      studentList.find(
                        (student) => student.id === parseInt(selectedStudent)
                      ).tutor.name
                    }{" "}
                    to{" "}
                    {
                      tutorList.find(
                        (tutor) => tutor.id === parseInt(selectedTutor)
                      ).name
                    }
                    {""}?
                  </span>
                )}
              </>
            ) : (
              <span>
                Are you sure you want to assign{" "}
                {
                  studentList.find(
                    (student) => student.id === parseInt(selectedStudent)
                  ).name
                }{" "}
                to{" "}
                {
                  tutorList.find(
                    (tutor) => tutor.id === parseInt(selectedTutor)
                  ).name
                }
                {""}?
              </span>
            )}
            <div className={styles.formBtnHolder}>
              <button
                className={styles.assignButton}
                onClick={() => confirmAssign()}
              >
                Confirm
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setIsAssignConfirmOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </CenterBox>
      )}
    </>
  );
}

export default Assign;
