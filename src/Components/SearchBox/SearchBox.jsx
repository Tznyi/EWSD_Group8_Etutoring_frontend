import styles from "./SearchBox.module.css";

function SearchBox({
  id,
  value,
  onChange,
  placeHolder,
  onSubmit,
  color = "#ffffff",
  wdith = "",
  focused = false,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form
      className={styles.searchBoxHolder}
      style={{ "--custom-color": color }}
    >
      <div className={styles.searchInput}>
        <input
          type="text"
          id={id}
          value={value}
          onChange={(e) => onChange(e)}
          placeholder={placeHolder}
          style={{ "--custome-width": wdith }}
          autoFocus={focused}
        />
      </div>

      <button
        id="btnSearch"
        onClick={(e) => handleSubmit(e)}
        className={styles.btnSearch}
      >
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </form>
  );
}

export default SearchBox;
