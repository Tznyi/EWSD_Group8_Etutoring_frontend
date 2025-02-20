import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { UserProvider } from "./Context/UserContext";
import { TutorProvider } from "./Context/TutorContext";
import { StaffProvider } from "./Context/StaffContext";
import { StudentProvider } from "./Context/StudentContext";

// Route Imports

const StaffDashboard = lazy(() => import("./Pages/Dashboard/StaffDashboard"));
const StudentDashboard = lazy(() =>
  import("./Pages/Dashboard/StudentDashboard")
);
const TutorDashboard = lazy(() => import("./Pages/Dashboard/TutorDashboard"));
const TutorReport = lazy(() => import("./Pages/ReportPages/TutorReport"));
const StaffReport = lazy(() => import("./Pages/ReportPages/StaffReport"));
const LoginForm = lazy(() => import("./Pages/LoginPage/Login"));
const AssignPage = lazy(() => import("./Pages/AssignPage/Assign"));
const ProfilePage = lazy(() => import("./Pages/ProfilePage/Profile"));
const TutorInfoPage = lazy(() => import("./Pages/ProfilePage/TutorView"));

const StaffMessage = lazy(() =>
  import("./Pages/MeetingPage/Staff/StaffMeeting")
);
const TutorMeeting = lazy(() =>
  import("./Pages/MeetingPage/Tutor/TutorMeeting")
);
const StudentMeeting = lazy(() =>
  import("./Pages/MeetingPage/Student/StudentMeeting")
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoginForm />}></Suspense>
      <UserProvider>
        <Routes>
          <Route index element={<Navigate replace to="login" />} />
          <Route path="login" element={<LoginForm />} />

          {/* ----------- This is staff routes ----------- */}
          <Route
            path="staffdashboard"
            element={
              <StaffProvider>
                <StaffDashboard />
              </StaffProvider>
            }
          >
            <Route index element={<Navigate replace to="report" />} />
            <Route path="report" element={<StaffReport />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="assign" element={<AssignPage />} />
            <Route path="meeting" element={<StaffMessage />} />
          </Route>

          {/* ----------- This is tutor routes ----------- */}

          <Route
            path="tutordashboard"
            element={
              <TutorProvider>
                <TutorDashboard />
              </TutorProvider>
            }
          >
            <Route index element={<Navigate replace to="report" />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="report" element={<TutorReport />} />
            <Route path="meeting" element={<TutorMeeting />} />
          </Route>

          {/* ----------- This is student routes ----------- */}

          <Route
            path="studentdashboard"
            element={
              <StudentProvider>
                <StudentDashboard />
              </StudentProvider>
            }
          >
            <Route path="profile" element={<ProfilePage />} />
            <Route path="tutor" element={<TutorInfoPage />} />
            <Route path="meeting" element={<StudentMeeting />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
