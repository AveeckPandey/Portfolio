"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const mode = pathname.startsWith("/ai") ? "ai" : "software";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return children;
}
