import { createContext, useContext, useState } from "react";
import useSessionStorage from "../hooks/useSessionStorage";

export const ColorContext = createContext();

export const ColorContextProvider = ({ children }) => {
  // Using useSessionStorage hook to manage theme in sessionStorage
  const [theme, setTheme] = useSessionStorage("theme", "light");

  return (
    <ColorContext.Provider value={{ theme, setTheme }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useTheme = () => useContext(ColorContext);
