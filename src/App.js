import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { UserProvider } from "./Context/UserContext";
import { TutorProvider } from "./Context/TutorContext";
import { StaffProvider } from "./Context/StaffContext";
import { StudentProvider } from "./Context/StudentContext";
import { MeetingProvider } from "./Context/MeetingContext";

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
const CreateMeeting = lazy(() =>
  import("./Pages/MeetingPage/Tutor/CreateMeeting")
);
const EditMeeting = lazy(() => import("./Pages/MeetingPage/Tutor/EditMeeting"));
const TutorViewMeeting = lazy(() =>
  import("./Pages/MeetingPage/Tutor/ViewMeeting")
);
const StaffViewMeeting = lazy(() =>
  import("./Pages/MeetingPage/Staff/ViewMeeting")
);
const StudentMeeting = lazy(() =>
  import("./Pages/MeetingPage/Student/StudentMeeting")
);
const StudentViewMeeting = lazy(() =>
  import("./Pages/MeetingPage/Student/ViewMeeting")
);
const RequestMeeting = lazy(() =>
  import("./Pages/MeetingPage/Student/RequestMeeting")
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
                <MeetingProvider>
                  <StaffDashboard />
                </MeetingProvider>
              </StaffProvider>
            }
          >
            <Route index element={<Navigate replace to="report" />} />
            <Route path="report" element={<StaffReport />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="assign" element={<AssignPage />} />
            <Route path="meeting" element={<StaffMessage />} />
            <Route path="viewmeeting" element={<StaffViewMeeting />} />
          </Route>

          {/* ----------- This is tutor routes ----------- */}

          <Route
            path="tutordashboard"
            element={
              <TutorProvider>
                <MeetingProvider>
                  <TutorDashboard />
                </MeetingProvider>
              </TutorProvider>
            }
          >
            <Route index element={<Navigate replace to="report" />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="report" element={<TutorReport />} />
            <Route path="meeting" element={<TutorMeeting />} />
            <Route path="createmeeting" element={<CreateMeeting />} />
            <Route path="editmeeting" element={<EditMeeting />} />
            <Route path="viewmeeting" element={<TutorViewMeeting />} />
          </Route>

          {/* ----------- This is student routes ----------- */}

          <Route
            path="studentdashboard"
            element={
              <StudentProvider>
                <MeetingProvider>
                  <StudentDashboard />
                </MeetingProvider>
              </StudentProvider>
            }
          >
            <Route path="profile" element={<ProfilePage />} />
            <Route path="tutor" element={<TutorInfoPage />} />
            <Route path="meeting" element={<StudentMeeting />} />
            <Route path="request" element={<RequestMeeting />} />
            <Route path="viewmeeting" element={<StudentViewMeeting />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
