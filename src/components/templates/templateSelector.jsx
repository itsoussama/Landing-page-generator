import SimpleTemplate from "./simpleTemplate";
import { TemplateComponents } from "./templateConfig";

const TemplateSelector = ({ onSelect }) => {
  return (
    <div>
      <h2>Choose a Template</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        {TemplateComponents.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template)}
            style={{ padding: "10px" }}
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
