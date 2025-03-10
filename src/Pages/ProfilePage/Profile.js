import styles from "./Profile.module.css";
import { useUser } from "../../Context/UserContext";
import { useLocation } from "react-router";
import { useEffect } from "react";

function Profile() {
  const { user, token, logOut } = useUser();

  // Logout function
  const handleLogout = () => {
    logOut(token);
  };

  // reset scroll

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={styles.profileMainframe}>
      <div className={styles.profileBanner}>
        <h1>Personal Information</h1>
        <div className={styles.profileImageHolder}>
          <img src={user.profile_picture} alt="profile_picture" />
        </div>
      </div>
      <div className={styles.infoSection}>
        <div className={styles.infoHolder}>
          <div className={styles.infoColDisplay}>
            <div className={styles.infoBox}>
              <span>Full Name</span>
              <span className={styles.info}>
                {user.name} <i className="fa-regular fa-user"></i>
              </span>
            </div>
            <div className={styles.infoBox}>
              <span>Email Address</span>
              <span className={styles.info}>
                {user.email} <i className="fa-regular fa-envelope"></i>
              </span>
            </div>
          </div>
          <div className={styles.infoBox}>
            <span>Role</span>
            <span className={styles.info}>
              {user.role} <i className="fa-regular fa-address-card"></i>
            </span>
          </div>
        </div>
        <div className={styles.redButton} onClick={() => handleLogout()}>
          Log Out
        </div>
      </div>
    </div>
  );
}

export default Profile;
