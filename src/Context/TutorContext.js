const { createContext, useReducer, useEffect, useContext } = require("react");
const { useUser } = require("./UserContext");

// -------------------------------------------
// ---- Temporary Data ----

const assignedStudentList = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phoneNo: "+1234567890",
    role: "student",
    latestVisitedDate: "2025-02-10T14:30:00Z",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    phoneNo: "+1987654321",
    role: "student",
    latestVisitedDate: "2025-02-11T09:15:00Z",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    phoneNo: "+1122334455",
    role: "student",
    latestVisitedDate: "2025-02-09T18:45:00Z",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@example.com",
    phoneNo: "+1567890123",
    role: "student",
    latestVisitedDate: "2025-02-12T07:20:00Z",
  },
  {
    id: 5,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phoneNo: "+1654321987",
    role: "student",
    latestVisitedDate: "2025-02-10T22:10:00Z",
  },
  {
    id: 6,
    name: "Franklin Carter",
    email: "franklin.carter@example.com",
    phoneNo: "+1789456123",
    role: "student",
    latestVisitedDate: "2025-02-08T12:45:00Z",
  },
  {
    id: 7,
    name: "Grace Lee",
    email: "grace.lee@example.com",
    phoneNo: "+1908765432",
    role: "student",
    latestVisitedDate: "2025-02-12T16:30:00Z",
  },
  {
    id: 8,
    name: "Henry Martinez",
    email: "henry.martinez@example.com",
    phoneNo: "+1345678901",
    role: "student",
    latestVisitedDate: "2025-02-11T08:00:00Z",
  },
  {
    id: 9,
    name: "Isabella Robinson",
    email: "isabella.robinson@example.com",
    phoneNo: "+1456789012",
    role: "student",
    latestVisitedDate: "2025-02-10T20:15:00Z",
  },
  {
    id: 10,
    name: "Jack Turner",
    email: "jack.turner@example.com",
    phoneNo: "+1567890345",
    role: "student",
    latestVisitedDate: "2025-02-09T13:55:00Z",
  },
];

const inactiveStudentList = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phoneNo: "+1234567890",
    role: "student",
    latestVisitedDate: "2025-02-10T14:30:00Z",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    phoneNo: "+1987654321",
    role: "student",
    latestVisitedDate: "2025-02-11T09:15:00Z",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    phoneNo: "+1122334455",
    role: "student",
    latestVisitedDate: "2025-02-09T18:45:00Z",
  },
];

// -------------------------------------------

const Base_URL = "https/localhost....";

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

  const { user } = useUser();

  useEffect(() => {
    // async function initialFetchData() {
    //   dispatch({ type: "setContextLoading", payload: true });
    //   try {
    //     const [assignedRes, inactiveRes] = await Promise.all([
    //       fetch(`${Base_URL}/assignedStudent/${user.id}`),
    //       fetch(`${Base_URL}/inactivestudent/${user.id}`),
    //     ]);

    //     const [assignedData, inactiveData] = await Promise.all([
    //       assignedRes.json(),
    //       inactiveRes.json(),
    //     ]);

    //     dispatch({ type: "setAssignedStudents", payload: assignedData.data });
    //     dispatch({ type: "setInactiveStudents", payload: inactiveData.data });
    //   } catch {
    //     console.log("Error while fetching initial data for tutor");
    //   } finally {
    //     dispatch({ type: "setContextLoading", payload: false });
    //   }
    // }

    // initialFetchData();

    // ---- Temp ----
    dispatch({ type: "setAssignedStudents", payload: assignedStudentList });
    dispatch({ type: "setInactiveStudents", payload: inactiveStudentList });

    const interval = setInterval(() => {
      //   initialFetchData();
      dispatch({ type: "setAssignedStudents", payload: assignedStudentList });
      dispatch({ type: "setInactiveStudents", payload: inactiveStudentList });
    }, 300000);

    return () => clearInterval(interval);
  }, [user]);

  async function fetchAssignedStudent() {
    try {
      dispatch({ type: "setContextLoading", payload: true });
      const res = await fetch(`${Base_URL}/assignedStudent/${user.id}`);
      const data = res.json();
      dispatch({ type: "setAssignedStudents", payload: data.data });
    } catch {
      console.log("Error while fetching assigned student");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  async function fetchInactiveStudent() {
    try {
      dispatch({ type: "setContextLoading", payload: true });
      const res = await fetch(`${Base_URL}/inactivestudent/${user.id}`);
      const data = res.json();
      dispatch({ type: "setInactiveStudents", payload: data.data });
    } catch {
      console.log("Error while fetching inactive student");
    } finally {
      dispatch({ type: "setContextLoading", payload: false });
    }
  }

  return (
    <TutorContext.Provider
      value={{
        assignedStudents,
        inactiveStudents,
        isContextLoading,
        fetchAssignedStudent,
        fetchInactiveStudent,
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
