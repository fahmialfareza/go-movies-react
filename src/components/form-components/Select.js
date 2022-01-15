const Select = ({ name, title, options, value, handleChange, placeholder }) => {
  return (
    <div className="mb-3">
      <label className="form-label font-weight-bold">{title}</label>
      <select
        className="form-select"
        name={name}
        value={value}
        onChange={handleChange}
      >
        <option value="" className="form-select">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            value={option.id}
            label={option.value}
            key={option.id}
            className="form-select"
          >
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
