import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "morning" | "night";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customTheme: string;
  setCustomTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [customTheme, setCustomTheme] = useState<string>("default");

  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboard-theme") as Theme;
    const savedCustomTheme = localStorage.getItem("dashboard-custom-theme");
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedCustomTheme) {
      setCustomTheme(savedCustomTheme);
    }

    // Auto-detect time-based themes
    const hour = new Date().getHours();
    if (savedTheme === "light" || savedTheme === "dark") {
      if (hour >= 6 && hour < 12) {
        setCustomTheme("morning");
      } else if (hour >= 20 || hour < 6) {
        setCustomTheme("night");
      } else {
        setCustomTheme("default");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboard-theme", theme);
    localStorage.setItem("dashboard-custom-theme", customTheme);

    // Apply theme classes
    const root = document.documentElement;
    root.classList.remove("light", "dark", "morning", "night");
    root.classList.add(theme);
    root.classList.add(customTheme);

    // Apply custom CSS variables based on theme
    switch (customTheme) {
      case "morning":
        root.style.setProperty("--primary-hue", "45");
        root.style.setProperty("--primary-sat", "90%");
        root.style.setProperty("--primary-light", "54%");
        root.style.setProperty("--bg-gradient", "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)");
        break;
      case "night":
        root.style.setProperty("--primary-hue", "240");
        root.style.setProperty("--primary-sat", "70%");
        root.style.setProperty("--primary-light", "35%");
        root.style.setProperty("--bg-gradient", "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)");
        break;
      default:
        root.style.setProperty("--primary-hue", "207");
        root.style.setProperty("--primary-sat", "90%");
        root.style.setProperty("--primary-light", "54%");
        root.style.setProperty("--bg-gradient", "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)");
    }
  }, [theme, customTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, customTheme, setCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}