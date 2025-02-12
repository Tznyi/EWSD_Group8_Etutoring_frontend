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
  return (
    <BrowserRouter>
      {/* maybe add login page here when it's done  */}
      {/* <Suspense fallback={<LoginPage/>}></Suspense> */}
      <UserProvider>
        <Routes>
          <Route path="staffDashboard" element={<StaffDashboard />}></Route>
          <Route
            path="tutorDashboard"
            element={
              <TutorProvider>
                <TutorDashboard />
              </TutorProvider>
            }
          >
            <Route index element={<Navigate replace to="report" />} />
            <Route path="report" element={<TutorReport />} />
          </Route>
          <Route path="studentDashboard" element={<StudentDashboard />}></Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
