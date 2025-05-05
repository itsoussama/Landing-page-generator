const FormInput = ({
  label,
  value,
  containerClassName,
  type = "text",
  ...attr
}) => (
  <div className={containerClassName}>
    <label>{label}</label>
    <input type={type} value={value} {...attr} />
  </div>
);

const FormTextArea = ({ label, value, ...attr }) => (
  <div>
    <label>{label}</label>
    <textarea value={value} rows={5} {...attr}></textarea>
  </div>
);

const FormSelect = ({ label, value, placeholder, children, ...attr }) => (
  <div>
    <label>{label}</label>
    <select value={value} {...attr}>
      <option selected disabled>
        {placeholder}
      </option>
      {children}
    </select>
  </div>
);

FormSelect.Options = ({ value, label }) => (
  <option value={value}>{label}</option>
);

export { FormInput, FormTextArea, FormSelect };
