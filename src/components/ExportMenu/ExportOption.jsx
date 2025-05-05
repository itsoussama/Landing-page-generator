import React from "react";

const ExportOption = ({ children, onClick, type }) => {
  return (
    <span className="dropdown-item" onClick={onClick} data-format={type}>
      {children}
    </span>
  );
};

export default ExportOption;
