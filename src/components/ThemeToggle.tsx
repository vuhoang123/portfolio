"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Dark mode"
      aria-pressed={theme === "dark"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
    >
      <Moon className="theme-toggle-dark" size={19} strokeWidth={1.75} aria-hidden="true" />
      <Sun className="theme-toggle-light" size={19} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
