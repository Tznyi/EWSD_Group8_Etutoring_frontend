import { useEffect, useRef, useState } from "react";
import SearchBox from "../../Components/SearchBox/SearchBox";
import styles from "./Dashboard.module.css";
import { Outlet, useLocation, useNavigate } from "react-router";
import Sidebar from "../../Components/SideBar/Sidebar";
import { useUser } from "../../Context/UserContext";
import { useStaff } from "../../Context/StaffContext";

function StaffDashboard() {
  const [searchKey, setSearchKey] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { isAuthenticated } = useUser();

  const { pathname } = useLocation();

  const { combinedList } = useStaff();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const navigate = useNavigate();
  const searchBox = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBox.current && !searchBox.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  function handleSearch() {
    setSearchList(
      combinedList.filter((user) =>
        user.name
          .replace(/\s/g, "")
          .toLowerCase()
          .includes(searchKey.replace(/\s/g, "").toLowerCase())
      )
    );

    setIsSearchOpen(true);
  }

  return (
    <div className={styles.dashboardMainFrame}>
      {/* <div className={styles.temporarySideBar}></div> */}
      <div className={styles.sidebarHolder}>
        <Sidebar role={"staff"} />
      </div>

      <div className={styles.pageContent}>
        <div className={styles.dashboardBanner}>
          <h1 className="systemTitle"><img src="/logo.png"/>EduSpark eTutoring System</h1>
          <div className={styles.searchHolder}>
            <SearchBox
              id="txtSearch"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeHolder="Name"
              wdith="20em"
              onSubmit={() => handleSearch()}
            />
            {isSearchOpen && (
              <div
                className={styles.searchResults}
                id="searchBox"
                ref={searchBox}
              >
                <div className={styles.searchListHolder}>
                  {searchList.length > 0 ? (
                    <>
                      {searchList.map((result, index) => (
                        <div
                          key={index}
                          className={styles.studentBox}
                          onClick={() => {
                            navigate(
                              `${
                                result.role === "tutor"
                                  ? "./tutordetails"
                                  : "./studentdetails"
                              }`,
                              {
                                state: { id: result.id },
                              }
                            );
                          }}
                        >
                          <img src={result.profile_picture} alt="profile-pic" />
                          <span>{result.name}</span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p>No matching result!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.outletHolder}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
