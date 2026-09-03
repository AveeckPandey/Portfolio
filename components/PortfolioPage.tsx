"use client";

import { type ReactNode, useEffect, useState } from "react";
import type { PortfolioData, ThemeTokens } from "@/lib/types";

interface PortfolioPageProps {
  data: PortfolioData;
  theme: ThemeTokens;
  children: ReactNode;
}

export default function PortfolioPage({ data, theme, children }: PortfolioPageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <main
      className="pt-16"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      {children}
    </main>
  );
}
