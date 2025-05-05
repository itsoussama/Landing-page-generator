import React, { createContext, useState, useContext, useEffect } from "react";
import { getCssVariable, setCss } from "../helpers/cssStyleValueHelper";

const TemplateContext = createContext();

export const TemplateProvider = ({ children }) => {
  const [template, setTemplate] = useState({
    colors: {
      primary: getCssVariable("--primary") || "",
      secondary: getCssVariable("--secondary"),
      accent: getCssVariable("--accent"),
    },
    textColors: {
      primary: getCssVariable("--text-primary"),
      secondary: getCssVariable("--text-secondary"),
      accent: getCssVariable("--text-accent"),
    },
  });

  // Update both state and CSS variables
  const updateTemplateTheme = (newTheme) => {
    // Update CSS variables

    newTheme?.colors?.primary && setCss("--primary", newTheme.colors.primary);
    newTheme?.colors?.secondary &&
      setCss("--secondary", newTheme.colors.secondary);
    newTheme?.colors?.accent && setCss("--accent", newTheme.colors.accent);
    newTheme?.textColors?.primary &&
      setCss("--text-primary", newTheme.textColors.primary);
    newTheme?.textColors?.secondary &&
      setCss("--text-secondary", newTheme.textColors.secondary);
    newTheme?.textColors?.accent &&
      setCss("--text-accent", newTheme.textColors.accent);

    // Update state
    setTemplate((prev) => ({
      ...prev,
      colors: {
        primary: newTheme?.colors?.primary || prev.primary,
        secondary: newTheme?.colors?.secondary || prev.colors.secondary,
      },
      textColors: {
        primary: newTheme?.textColors?.primary || prev.textColors.primary,
        secondary: newTheme?.textColors?.secondary || prev.textColors.secondary,
        accent: newTheme?.textColors?.accent || prev.textColors.accent,
      },
    }));
  };

  const LoadTheme = () => {
    setTemplate({
      colors: {
        primary: getCssVariable("--primary"),
        secondary: getCssVariable("--secondary"),
        accent: getCssVariable("--accent"),
      },
      textColors: {
        primary: getCssVariable("--text-primary"),
        secondary: getCssVariable("--text-secondary"),
        accent: getCssVariable("--text-accent"),
      },
    });
  };

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", LoadTheme, true);
    return () =>
      document.removeEventListener("DOMContentLoaded", LoadTheme, true);
  });

  return (
    <TemplateContext.Provider value={{ template, updateTemplateTheme }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
};
