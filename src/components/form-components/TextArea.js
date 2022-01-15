const TextArea = ({ name, title, rows, value, handleChange }) => {
  return (
    <div className="mb-3">
      <label className="form-label font-weight-bold">{title}</label>
      <textarea
        name={name}
        id={name}
        rows={rows}
        className="form-control"
        onChange={handleChange}
        value={value}
      />
    </div>
  );
};

export default TextArea;
