import styles from "./CenterBox.module.css";

function CenterBox({ children, closeFun }) {
  function handleOnClick(e) {
    if (e.target.id === "mainFrame") {
      closeFun();
    }
  }

  return (
    <div
      className={styles.mainFrame}
      onClick={(e) => handleOnClick(e)}
      id="mainFrame"
    >
      <div className={styles.alertBox}>{children}</div>
    </div>
  );
}

export default CenterBox;
