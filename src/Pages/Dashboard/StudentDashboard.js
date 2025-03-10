import { useEffect, useState } from "react";
import SearchBox from "../../Components/SearchBox/SearchBox";
import styles from "./Dashboard.module.css";
import { Outlet, useLocation, useNavigate } from "react-router";
import Sidebar from "../../Components/SideBar/Sidebar";
import { useUser } from "../../Context/UserContext";

function StudentDashboard() {
  const [searchKey, setSearchKey] = useState("");

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

  function handleSearch() {
    console.log(searchKey);
  }

  return (
    <div className={styles.dashboardMainFrame}>
      {/* <div className={styles.temporarySideBar}></div> */}
      <div className={styles.sidebarHolder}>
        <Sidebar role={"student"} />
      </div>

      <div className={styles.pageContent}>
        <div className={styles.dashboardBanner}>
          <h1>Edu Spark</h1>
          <div className={styles.searchHolder}>
            <SearchBox
              id="txtSearch"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeHolder="Name"
              wdith="20em"
              onSubmit={() => handleSearch()}
            />
          </div>
        </div>
        <div className={styles.outletHolder}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
