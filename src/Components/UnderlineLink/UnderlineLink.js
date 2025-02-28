import styles from "./UnderlineLink.module.css";

function UnderlineLink({ onClick, children }) {
  return (
    <span className={styles.link} onClick={() => onClick()}>
      {children}
    </span>
  );
}

export default UnderlineLink;
