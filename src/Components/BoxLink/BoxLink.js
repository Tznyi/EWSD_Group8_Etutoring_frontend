import styles from "./BoxLink.module.css";

function BoxLink({
  onClick,
  children,
  hasBackground = false,
  selected = false,
}) {
  return (
    <span
      className={`${styles.link} ${hasBackground && styles.grayBackground} ${
        selected && styles.selected
      }`}
      onClick={() => onClick()}
    >
      {children}
    </span>
  );
}

export default BoxLink;
