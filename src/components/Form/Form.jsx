import React from "react";

const FormContext = React.createContext();

const Form = ({ children, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <FormContext.Provider value={{}}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  );
};

export default Form;
