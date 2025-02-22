import styles from "./AddButton.module.css";

function AddButton({ children, onClick }) {
  return (
    <div className={styles.createBtn} onClick={() => onClick()}>
      <span>{children}</span>
      <i className="fa-solid fa-plus"></i>
    </div>
  );
}

export default AddButton;
