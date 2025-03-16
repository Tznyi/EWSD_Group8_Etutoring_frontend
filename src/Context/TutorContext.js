const { createContext, useReducer, useEffect, useContext } = require("react");
const { useUser } = require("./UserContext");

// -------------------------------------------

const Base_URL = "http://127.0.0.1:8000/api/tutor";

const TutorContext = createContext();

const initialState = {
  assignedStudents: [],
  inactiveStudents: [],
  isContextLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "setContextLoading":
      return {
        ...state,
        isContextLoading: action.payload,
      };
    case "setAssignedStudents":
      return {
        ...state,
        assignedStudents: action.payload,
      };
    case "setInactiveStudents":
      return {
        ...state,
        inactiveStudents: action.payload,
      };
    default:
      throw new Error("Unknown action");
  }
}

function TutorProvider({ children }) {
  const [{ assignedStudents, inactiveStudents, isContextLoading }, dispatch] =
    useReducer(reducer, initialState);

  const { user, token } = useUser();

  useEffect(() => {
    if (user.role !== "tutor") return;

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
        const [studentRes, inactiveRes] = await Promise.all([
          fetch(`${Base_URL}/students-info`, { headers }),
          fetch(
            "http://127.0.0.1:8000/api/reports/students/no-interaction/7",
            requestOptions
          ),
        ]);

        const [studentData, inactiveData] = await Promise.all([
          studentRes.json(),
          inactiveRes.json(),
        ]);

        const studentList = studentData.students;
        const inactiveList = inactiveData.students_with_no_interaction_in_7days;

        dispatch({ type: "setAssignedStudents", payload: studentList });
        dispatch({ type: "setInactiveStudents", payload: inactiveList });
      } catch {
        console.log("Error while fetching initial data for tutor");
      } finally {
        dispatch({ type: "setContextLoading", payload: false });
      }
    }

    initialFetchData();
  }, [user, token]);

  return (
    <TutorContext.Provider
      value={{
        assignedStudents,
        inactiveStudents,
        isContextLoading,
      }}
    >
      {children}
    </TutorContext.Provider>
  );
}

function useTutor() {
  const context = useContext(TutorContext);
  if (context === undefined)
    throw new Error("TutorContext was used outside of TutorProvider");
  return context;
}

export { TutorProvider, useTutor };
