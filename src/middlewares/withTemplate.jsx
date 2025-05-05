import React from "react";

export const withTemplate = (TemplateComponent) => {
  console.log("TemplateComponent", TemplateComponent);

  return (props) => <TemplateComponent {...props} />;
};
