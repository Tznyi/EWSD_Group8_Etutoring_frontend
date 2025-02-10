import styles from "./SearchBox.module.css";

function SearchBox({
  id,
  value,
  onChange,
  placeHolder,
  onSubmit,
  color = "#eaeaea",
  wdith = "",
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
