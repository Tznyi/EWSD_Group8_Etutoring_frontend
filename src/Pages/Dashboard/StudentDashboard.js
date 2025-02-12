import { useState } from "react";
import SearchBox from "../../Components/SearchBox/SearchBox";
import styles from "./Dashboard.module.css";
import { Outlet } from "react-router";

function StudentDashboard() {
  const [searchKey, setSearchKey] = useState("");

  function handleSearch() {
    console.log(searchKey);
  }

  return (
    <div className={styles.dashboardMainFrame}>
      <div className={styles.temporarySideBar}></div>

      <div className={styles.pageContent}>
        <div className={styles.dashboardBanner}>
          <h2>(Name)</h2>
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
