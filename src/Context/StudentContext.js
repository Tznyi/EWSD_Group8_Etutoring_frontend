import { createContext, useContext, useEffect, useReducer } from "react";
import { useUser } from "./UserContext";

const Base_URL = "http://127.0.0.1:8000/api/student";

const StudentContext = createContext();

const initialState = {
  tutorInfo: {},
  isContextLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "setContextLoading":
      return {
        ...state,
        isContextLoading: action.payload,
      };
    case "setTutor":
      return {
        ...state,
        tutorInfo: action.payload,
      };
    default:
      throw new Error("Unknown action");
  }
}

function StudentProvider({ children }) {
  const [{ tutorInfo, isContextLoading }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const { token } = useUser();

  useEffect(() => {
    async function initialFetchData() {
      dispatch({ type: "setContextLoading", payload: true });

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const res = await fetch(`${Base_URL}/tutor-info`, { headers });
        const data = await res.json();

        dispatch({ type: "setTutor", payload: data.tutor });
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
    <StudentContext.Provider
      value={{
        tutorInfo,
        isContextLoading,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined)
    throw new Error("StudentContext was used outside of StudentProvider");
  return context;
}

export { StudentProvider, useStudent };
