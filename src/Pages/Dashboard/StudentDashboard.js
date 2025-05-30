import { useEffect } from "react";
import styles from "./Dashboard.module.css";
import { Outlet, useLocation, useNavigate } from "react-router";
import Sidebar from "../../Components/SideBar/Sidebar";
import { useUser } from "../../Context/UserContext";

function StudentDashboard() {
  const { isAuthenticated } = useUser();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className={styles.dashboardMainFrame}>
      {/* <div className={styles.temporarySideBar}></div> */}
      <div className={styles.sidebarHolder}>
        <Sidebar role={"student"} />
      </div>

      <div className={styles.pageContent}>
        <div className={styles.dashboardBanner}>
        <h1 className="systemTitle"><img src="/logo.png"/>EduSpark eTutoring System</h1>
        </div>
        <div className={styles.outletHolder}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
