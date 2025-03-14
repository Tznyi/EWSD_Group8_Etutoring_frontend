const { createContext, useReducer, useEffect, useContext } = require("react");
const { useUser } = require("./UserContext");

// -------------------------------------------

const Base_URL = "http://127.0.0.1:8000/api/staff";
const Allocate_URL = "http://127.0.0.1:8000/api";

const StaffContext = createContext();

const initialState = {
  tutorList: [],
  studentList: [],
  assignedStudents: [],
  unassignedStudents: [],
  isContextLoading: false,
  message: "",
  hasMessage: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "setContextLoading":
      return {
        ...state,
        isContextLoading: action.payload,
      };
    case "showMessage":
      return {
        ...state,
        message: action.payload,
        hasMessage: true,
      };
    case "removeMessage":
      return {
        ...state,
        message: "",
        hasMessage: false,
      };
    case "setTutorList":
      return {
        ...state,
        tutorList: action.payload,
      };
    case "setStudentList":
      return {
        ...state,
        studentList: action.payload,
      };
    case "setAssignedStudents":
      return {
        ...state,
        assignedStudents: action.payload,
      };
    case "setUnassignedStudents":
      return {
        ...state,
        unassignedStudents: action.payload,
      };
    default:
      throw new Error("Unknown action");
  }
}

function StaffProvider({ children }) {
  const [
    {
      tutorList,
      studentList,
      assignedStudents,
      unassignedStudents,
      isContextLoading,
      message,
      hasMessage,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const { token } = useUser();

  useEffect(() => {
    async function initialFetchData() {
      dispatch({ type: "setContextLoading", payload: true });

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const [tutorRes, studentRes] = await Promise.all([
          fetch(`${Base_URL}/get-all-tutors`, { headers }),
          fetch(`${Base_URL}/get-all-students`, { headers }),
        ]);

        const [tutorData, studentData] = await Promise.all([
          tutorRes.json(),
          studentRes.json(),
        ]);

        const studentList = studentData.students;

        const unassignedStudents = studentList.filter(
          (student) => student.tutor == null
        );

        const assignedStudents = studentList.filter(
          (student) => student.tutor != null
        );

        dispatch({ type: "setTutorList", payload: tutorData.tutors });
        dispatch({ type: "setStudentList", payload: studentData.students });
        dispatch({
          type: "setAssignedStudents",
          payload: assignedStudents,
        });
        dispatch({
          type: "setUnassignedStudents",
          payload: unassignedStudents,
        });
      } catch {
        console.log("Error while fetching initial data for tutor");
      } finally {
        dispatch({ type: "setContextLoading", payload: false });
      }
    }

    initialFetchData();

    // ---- Temp ----

    // const interval = setInterval(() => {
    //   initialFetchData();
    // }, 300000);

    // return () => clearInterval(interval);
  }, []);

  async function fetchAll() {
    dispatch({ type: "setContextLoading", payload: true });

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const [tutorRes, studentRes] = await Promise.all([
        fetch(`${Base_URL}/get-all-tutors`, { headers }),
        fetch(`${Base_URL}/get-all-students`, { headers }),
      ]);

      const [tutorData, studentData] = await Promise.all([
        tutorRes.json(),
        studentRes.json(),
      ]);

      const studentList = studentData.students;

      const unassignedStudents = studentList.filter(
        (student) => student.tutor == null
      );

      const assignedStudents = studentList.filter(
        (student) => student.tutor != null
      );

      dispatch({ type: "setTutorList", payload: tutorData.tutors });
      dispatch({ type: "setStudentList", payload: studentData.students });
      dispatch({
        type: "setAssignedStudents",
        payload: assignedStudents,
      });
      dispatch({
        type: "setUnassignedStudents",
        payload: unassignedStudents,
      });
    } catch {
      console.log("Error while fetching initial data for tutor");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function assignStudent(tutorId, studentId) {
    dispatch({ type: "setContextLoading", payload: true });

    try {
      const formdata = new FormData();
      formdata.append("student_id", studentId);
      formdata.append("tutor_id", tutorId);

      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      };

      const res = await fetch(
        `${Allocate_URL}/allocate-student`,
        requestOptions
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      dispatch({ type: "showMessage", payload: data.message });
      fetchAll();
    } catch (error) {
      console.error("Assign error:", error.message);
      window.alert(error.message);
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function bulkAssign(tutorId, studentList) {
    dispatch({ type: "setContextLoading", payload: true });
    const rawData = {
      tutor_id: tutorId,
      student_ids: studentList,
    };

    try {
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rawData),
      };

      const res = await fetch(`${Allocate_URL}/bulk-allocate`, requestOptions);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      dispatch({ type: "showMessage", payload: data.message });
      fetchAll();
    } catch (error) {
      dispatch({ type: "showMessage", payload: error.message });
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function unassignStudent(studentId) {
    dispatch({ type: "setContextLoading", payload: true });

    try {
      const urlencoded = new URLSearchParams();
      urlencoded.append("student_id", studentId);

      const requestOptions = {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: urlencoded,
      };

      const res = await fetch(`${Allocate_URL}/remove-tutor`, requestOptions);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      dispatch({ type: "showMessage", payload: data.message });
      fetchAll();
    } catch (error) {
      console.error("Assign error:", error.message);
      window.alert(error.message);
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  function removeMessage() {
    dispatch({ type: "removeMessage" });
  }

  return (
    <StaffContext.Provider
      value={{
        tutorList,
        studentList,
        assignedStudents,
        unassignedStudents,
        isContextLoading,
        message,
        hasMessage,

        assignStudent,
        bulkAssign,
        unassignStudent,
        fetchAll,
        removeMessage,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
}

function useStaff() {
  const context = useContext(StaffContext);
  if (context === undefined)
    throw new Error("StaffContext was used outside of StaffProvider");
  return context;
}

export { StaffProvider, useStaff };
