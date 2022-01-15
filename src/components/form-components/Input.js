const Input = ({
  name,
  title,
  type,
  value,
  handleChange,
  placeholder,
  errorDiv,
  errorMsg,
  className,
}) => {
  return (
    <div className="mb-3">
      <label className="form-label font-weight-bold">{title}</label>
      <input
        type={type}
        className={`form-control ${className}`}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <div className={errorDiv}>{errorMsg}</div>
    </div>
  );
};

export default Input;
