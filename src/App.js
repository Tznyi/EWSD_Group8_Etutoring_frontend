import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { lazy } from "react";

// Route Imports

const StaffDashboard = lazy(() => import("./Pages/Dashboard/StaffDashboard"));
const StudentDashboard = lazy(() =>
  import("./Pages/Dashboard/StudentDashboard")
);
const TutorDashboard = lazy(() => import("./Pages/Dashboard/TutorDashboard"));

function App() {
  return (
    <BrowserRouter>
      {/* maybe add login page here when it's done  */}
      {/* <Suspense fallback={<LoginPage/>}></Suspense> */}
      <Routes>
        <Route path="staffDashboard" element={<StaffDashboard />}></Route>
        <Route path="tutorDashboard" element={<TutorDashboard />}></Route>
        <Route path="studentDashboard" element={<StudentDashboard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
