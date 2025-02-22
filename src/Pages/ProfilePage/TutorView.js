import styles from "./Profile.module.css";
import { useStudent } from "../../Context/StudentContext";

function Profile() {
  const { tutorInfo } = useStudent();

  return (
    <div className={styles.profileMainframe}>
      {tutorInfo.id ? (
        <>
          <div className={styles.profileBanner}>
            <h1>Tutor Information</h1>
            <div className={styles.profileImageHolder}>
              <img src={tutorInfo.profile_picture} alt="profile_picture" />
            </div>
          </div>
          <div className={styles.infoSection}>
            <div className={styles.infoHolder}>
              <div className={styles.infoColDisplay}>
                <div className={styles.infoBox}>
                  <span>Full Name</span>
                  <span className={styles.info}>
                    {tutorInfo.name} <i className="fa-regular fa-user"></i>
                  </span>
                </div>
                <div className={styles.infoBox}>
                  <span>Email Address</span>
                  <span className={styles.info}>
                    {tutorInfo.email} <i className="fa-regular fa-envelope"></i>
                  </span>
                </div>
              </div>
              <div className={styles.infoBox}>
                <span>Role</span>
                <span className={styles.info}>
                  {tutorInfo.role}{" "}
                  <i className="fa-regular fa-address-card"></i>
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.notFound}>
          No Tutor Assigned Yet! <br /> Please Wait!
        </div>
      )}
    </div>
  );
}

export default Profile;
