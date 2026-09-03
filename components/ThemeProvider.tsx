"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type Mode = "software" | "ai";

interface ThemeContextValue {
  mode: Mode;
}

const ThemeContext = createContext<ThemeContextValue>({ mode: "software" });

export function useMode(): ThemeContextValue {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const mode: Mode = pathname.startsWith("/ai") ? "ai" : "software";

  useEffect(() => {
    setMounted(true);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ mode: "software" }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ mode }}>
      {children}
    </ThemeContext.Provider>
  );
}
