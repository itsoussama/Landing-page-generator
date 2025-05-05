import React, { useEffect, useRef, useState } from "react";
import ExportOption from "./ExportOption";
import { useClickOutside } from "../../hooks/useClickOutside";

const ExportMenu = ({ children, onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [clickedOutside, setClickedOutside] = useClickOutside(dropdownRef);

  // const handleClickOutside = (event) => {
  //   const dropdownElem = dropdownRef.current;
  //   const target = event.target;

  //   if (!dropdownElem.contains(target)) setOpen(false);
  // };

  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    if (clickedOutside) {
      setIsOpen(false);
      setClickedOutside(false);
    }
  }, [clickedOutside, setClickedOutside]);

  return (
    <div className="export-dropdown" ref={dropdownRef}>
      <button
        id="generate-file"
        className="btn btn-primary dropdown-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Export <i className="fas fa-caret-down"></i>
      </button>
      <div
        className="dropdown-menu"
        style={{ display: isOpen ? "block" : "none" }}
      >
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            onClick: () => (onExport(child.props.type), setIsOpen(false)),
          });
        })}
      </div>
    </div>
  );
};

export default ExportMenu;
