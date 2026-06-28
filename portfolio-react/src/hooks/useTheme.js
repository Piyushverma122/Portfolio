import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";

// Convenience hook to read/toggle the current theme.
export function useTheme() {
  return useContext(ThemeContext);
}
