const {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useCallback,
} = require("react");
const { useUser } = require("./UserContext");

// -------------------------------------------

const Base_URL = "http://127.0.0.1:8000/api/staff";
const Allocate_URL = "http://127.0.0.1:8000/api";

const StaffContext = createContext();

const initialState = {
  tutorList: [],
  studentList: [],
  combinedList: [],
  assignedStudents: [],
  unassignedStudents: [],
  inactiveStudents7days: [],
  inactiveStudents28days: [],
  mostUsedBrowsers: [],
  averageMessage: 0,
  messageIn7Days: 0,
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
    case "setinactiveStudents":
      return {
        ...state,
        inactiveStudents7days: action.payload.day7,
        inactiveStudents28days: action.payload.day28,
      };
    case "setCombinedList":
      return {
        ...state,
        combinedList: action.payload,
      };
    case "setAverageMessage":
      return {
        ...state,
        averageMessage: action.payload,
      };
    case "setMessageIn7Days":
      return {
        ...state,
        messageIn7Days: action.payload,
      };
    case "setMostUsedBrowsers":
      return {
        ...state,
        mostUsedBrowsers: action.payload,
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
      combinedList,
      assignedStudents,
      unassignedStudents,
      inactiveStudents7days,
      inactiveStudents28days,
      mostUsedBrowsers,
      averageMessage,
      messageIn7Days,
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

      var requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };

      try {
        const [
          tutorRes,
          studentRes,
          inactiveStudent7Res,
          inactiveStudent28Res,
        ] = await Promise.all([
          fetch(`${Base_URL}/get-all-tutors`, { headers }),
          fetch(`${Base_URL}/get-all-students`, { headers }),
          fetch(
            "http://127.0.0.1:8000/api/reports/students/no-interaction/7",
            requestOptions
          ),
          fetch(
            "http://127.0.0.1:8000/api/reports/students/no-interaction/28",
            requestOptions
          ),
        ]);

        const [tutorData, studentData, inactiveData7, inactiveData28] =
          await Promise.all([
            tutorRes.json(),
            studentRes.json(),
            inactiveStudent7Res.json(),
            inactiveStudent28Res.json(),
          ]);

        const studentList = studentData.students;
        const inactiveStudent7 =
          inactiveData7.students_with_no_interaction_in_7days;
        const inactiveStudent28 =
          inactiveData28.students_with_no_interaction_in_28days;

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
        dispatch({
          type: "setinactiveStudents",
          payload: { day7: inactiveStudent7, day28: inactiveStudent28 },
        });
        dispatch({
          type: "setCombinedList",
          payload: [...tutorData.tutors, ...studentData.students],
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
  }, [token]);

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

  const fetchAverageMessage = useCallback(() => {
    async function fetchData() {
      dispatch({ type: "setContextLoading", payload: true });
      try {
        const headers = {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };

        var requestOptions = {
          method: "GET",
          headers: headers,
          redirect: "follow",
        };

        const res = await fetch(
          "http://127.0.0.1:8000/api/reports/messages/average-per-tutor",
          requestOptions
        );

        const data = await res.json();
        dispatch({
          type: "setAverageMessage",
          payload: data.average_messages_per_tutor,
        });
      } catch (error) {
        console.error("Assign error:", error.message);
        window.alert(error.message);
      } finally {
        dispatch({ type: "setContextLoading", payload: false });
      }
    }

    fetchData();
  }, [token]);

  const fetchMessageIn7Days = useCallback(() => {
    async function fetchData() {
      dispatch({ type: "setContextLoading", payload: true });
      try {
        const headers = {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };

        var requestOptions = {
          method: "GET",
          headers: headers,
          redirect: "follow",
        };

        const res = await fetch(
          "http://127.0.0.1:8000/api/reports/messages/last-7-days",
          requestOptions
        );

        const data = await res.json();
        dispatch({
          type: "setMessageIn7Days",
          payload: data.messages_last_7_days,
        });
      } catch (error) {
        console.error("Assign error:", error.message);
        window.alert(error.message);
      } finally {
        dispatch({ type: "setContextLoading", payload: false });
      }
    }

    fetchData();
  }, [token]);

  const fetchMostUsedBrowsers = useCallback(() => {
    async function fetchData() {
      dispatch({ type: "setContextLoading", payload: true });
      try {
        const headers = {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };

        var requestOptions = {
          method: "GET",
          headers: headers,
          redirect: "follow",
        };

        const res = await fetch(
          "http://127.0.0.1:8000/api/reports/most-used-browsers",
          requestOptions
        );

        const data = await res.json();
        dispatch({
          type: "setMostUsedBrowsers",
          payload: data.browser_usage,
        });
      } catch (error) {
        console.error("Assign error:", error.message);
        window.alert(error.message);
      } finally {
        dispatch({ type: "setContextLoading", payload: false });
      }
    }

    fetchData();
  }, [token]);

  return (
    <StaffContext.Provider
      value={{
        tutorList,
        studentList,
        combinedList,
        assignedStudents,
        unassignedStudents,
        inactiveStudents7days,
        inactiveStudents28days,
        mostUsedBrowsers,
        averageMessage,
        messageIn7Days,
        isContextLoading,
        message,
        hasMessage,

        assignStudent,
        bulkAssign,
        unassignStudent,
        fetchAll,
        fetchAverageMessage,
        fetchMessageIn7Days,
        fetchMostUsedBrowsers,
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
