import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { UserProvider } from "./Context/UserContext";
import { TutorProvider } from "./Context/TutorContext";
import { StaffProvider } from "./Context/StaffContext";
import { StudentProvider } from "./Context/StudentContext";
import { MeetingProvider } from "./Context/MeetingContext";
import { BlogProvider } from "./Context/BlogContext";

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
const StaffTutorInfoPage = lazy(() =>
  import("./Pages/ProfilePage/StaffTutorView")
);
const StaffStudentInfoPage = lazy(() =>
  import("./Pages/ProfilePage/StaffStudentView")
);
const StudentInfoPage = lazy(() => import("./Pages/ProfilePage/StudentView"));

// ---------------------- Meeting ----------------------

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

// ---------------------- Blogs ----------------------

const BlogList = lazy(() => import("./Pages/BlogPage/BlogDisplayPages/Blogs"));
const BlogDetails = lazy(() =>
  import("./Pages/BlogPage/BlogDetailPage/BlogDetails")
);
const CreateBlog = lazy(() =>
  import("./Pages/BlogPage/BlogFormPage/CreateBlog")
);
const UpdateBlog = lazy(() =>
  import("./Pages/BlogPage/BlogFormPage/UpdateBlog")
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
                  <BlogProvider>
                    <StaffDashboard />
                  </BlogProvider>
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
            <Route path="blogs" element={<BlogList />} />
            <Route path="blogdetails" element={<BlogDetails />} />
            <Route path="studentdetails" element={<StaffStudentInfoPage />} />
            <Route path="tutordetails" element={<StaffTutorInfoPage />} />
          </Route>

          {/* ----------- This is tutor routes ----------- */}

          <Route
            path="tutordashboard"
            element={
              <TutorProvider>
                <MeetingProvider>
                  <BlogProvider>
                    <TutorDashboard />
                  </BlogProvider>
                </MeetingProvider>
              </TutorProvider>
            }
          >
            <Route index element={<Navigate replace to="report" />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="studentdetails" element={<StudentInfoPage />} />

            <Route path="report" element={<TutorReport />} />
            <Route path="meeting" element={<TutorMeeting />} />
            <Route path="createmeeting" element={<CreateMeeting />} />
            <Route path="editmeeting" element={<EditMeeting />} />
            <Route path="viewmeeting" element={<TutorViewMeeting />} />
            <Route path="blogs" element={<BlogList />} />
            <Route path="blogdetails" element={<BlogDetails />} />
            <Route path="createblog" element={<CreateBlog />} />
            <Route path="updateblog" element={<UpdateBlog />} />
          </Route>

          {/* ----------- This is student routes ----------- */}

          <Route
            path="studentdashboard"
            element={
              <StudentProvider>
                <MeetingProvider>
                  <BlogProvider>
                    <StudentDashboard />
                  </BlogProvider>
                </MeetingProvider>
              </StudentProvider>
            }
          >
            <Route path="profile" element={<ProfilePage />} />
            <Route path="tutor" element={<TutorInfoPage />} />
            <Route path="meeting" element={<StudentMeeting />} />
            <Route path="request" element={<RequestMeeting />} />
            <Route path="viewmeeting" element={<StudentViewMeeting />} />
            <Route path="blogs" element={<BlogList />} />
            <Route path="blogdetails" element={<BlogDetails />} />
            <Route path="createblog" element={<CreateBlog />} />
            <Route path="updateblog" element={<UpdateBlog />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
