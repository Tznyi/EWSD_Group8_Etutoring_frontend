import { useEffect, useRef, useState } from "react";
import SearchBox from "../../Components/SearchBox/SearchBox";
import styles from "./Dashboard.module.css";

function StudentDashboard() {
  const [searchKey, setSearchKey] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (e.target.id === "btnNav") {
        setIsNavOpen(true);
        return;
      }
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsNavOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSearch() {
    console.log(searchKey);
  }

  function handleProfileOpen() {
    console.log("Open prifile");
  }

  return (
    <div className={styles.dashboardMainFrame}>
      <div className={styles.dashboardBanner}>
        {/* <h2>Staff Dashboard</h2> */}
        <div className={styles.navMenu} id="btnNav">
          {!isNavOpen ? (
            <i className="fa-solid fa-bars" id="btnNav"></i>
          ) : (
            <i className="fa-solid fa-xmark"></i>
          )}
        </div>
        <div className={styles.bannerSection1}>
          <h2>E-Tutoring</h2>
          <SearchBox
            id="txtSearch"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeHolder="Name"
            wdith="20em"
            onSubmit={() => handleSearch()}
          />
        </div>
        <div
          className={styles.bannerProfile}
          onClick={() => handleProfileOpen()}
        >
          <div className={styles.imageHolder}>
            <img src="./profile-pic.png" alt="profilePicture" />
          </div>
          <div className={styles.infoSection}>
            <span>Nicklas</span>{" "}
            <span className={styles.coloredText}>nicklas@gmail.com</span>
          </div>
        </div>
      </div>
      <div
        className={`${styles.sideBar} ${isNavOpen && styles.navOpen}`}
        ref={navRef}
      >
        <div>Side bar will go here</div>
        <div
          className={styles.sideBarProfile}
          onClick={() => handleProfileOpen()}
        >
          <div className={styles.imageHolder}>
            <img src="./profile-pic.png" alt="profilePicture" />
          </div>
          <div className={styles.infoSection}>
            <span>Nicklas</span>{" "}
            <span className={styles.coloredText}>nicklas@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
