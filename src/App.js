import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { lazy } from "react";
import { UserProvider } from "./Context/UserContext";
import { TutorProvider } from "./Context/TutorContext";

// Route Imports

const StaffDashboard = lazy(() => import("./Pages/Dashboard/StaffDashboard"));
const StudentDashboard = lazy(() =>
  import("./Pages/Dashboard/StudentDashboard")
);
const TutorDashboard = lazy(() => import("./Pages/Dashboard/TutorDashboard"));
const TutorReport = lazy(() => import("./Pages/ReportPages/TutorReport"));

function App() {

  const [userRole, setUserRole] = useState(null); // Initially null, to wait for API

  useEffect(() => {
    // Simulate fetching user role from an API
    const fetchUserRole = async () => {
      try {
        // Simulating API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simulated API response (Replace this with actual API call in future)
        const response = { role: "staff" }; // Change this for testing other roles

        setUserRole(response.role); // Update state with fetched role
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("student"); // Default to student if API fails
      }
    };

    fetchUserRole();
  }, []);

  // Show loading state while waiting for role
  if (!userRole) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      {/* maybe add login page here when it's done  */}
      {/* <Suspense fallback={<LoginPage/>}></Suspense> */}
      <UserProvider>
        <Routes>
          {/* Put the Login route here with condition eg(if(role) = "staff" route("staffdashboard")) */}
          <Route path="staffdashboard" element={<StaffDashboard />}></Route>
          <Route
            path="tutordashboard"
            element={
              <TutorProvider>
                <TutorDashboard />
              </TutorProvider>
            }
          >
            <Route index element={<Navigate replace to="report" />} />
            <Route path="report" element={<TutorReport />} />
          </Route>
          <Route path="studentdashboard" element={<StudentDashboard />}></Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;