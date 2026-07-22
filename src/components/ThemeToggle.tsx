"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("site-theme");
      if (stored) setTheme(stored);
      else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        setTheme("light");
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (theme === "light") document.documentElement.classList.add("theme-light");
    else document.documentElement.classList.remove("theme-light");
    try {
      localStorage.setItem("site-theme", theme);
    } catch (e) {}
  }, [theme]);

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-2 border border-line hover:scale-105 transition-transform text-ink"
    >
      {theme === "light" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
