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

  const { token } = useUser();

  useEffect(() => {
    async function initialFetchData() {
      dispatch({ type: "setContextLoading", payload: true });

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const res = await fetch(`${Base_URL}/students-info`, { headers });
        const data = await res.json();

        const studentList = data.students;

        const todayDate = new Date();

        const inactiveList = studentList.filter((student) => {
          let lastSeen = student.created_at;
          if (student.last_login) {
            lastSeen = student.last_login;
          }

          const lastSeenDate = new Date(lastSeen);

          const gapInDays = (todayDate - lastSeenDate) / (1000 * 60 * 60 * 24);

          if (Math.ceil(gapInDays) >= 7) {
            return true;
          } else {
            return false;
          }
        });

        dispatch({ type: "setAssignedStudents", payload: studentList });
        dispatch({ type: "setInactiveStudents", payload: inactiveList });
      } catch {
        console.log("Error while fetching initial data for tutor");
      } finally {
        dispatch({ type: "setContextLoading", payload: false });
      }
    }

    initialFetchData();

    const interval = setInterval(() => {
      initialFetchData();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

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
