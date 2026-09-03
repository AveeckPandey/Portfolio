import softwareTheme from "@/themes/software";
import aiTheme from "@/themes/ai";
import type { ThemeTokens } from "@/lib/types";

export function getTheme(mode: "software" | "ai"): ThemeTokens {
  return mode === "ai" ? aiTheme : softwareTheme;
}

export function themeToCSSVars(theme: ThemeTokens): Record<string, string> {
  return {
    "--bg": theme.background,
    "--fg": theme.foreground,
    "--primary": theme.primary,
    "--primary-fg": theme.primaryFg,
    "--secondary": theme.secondary,
    "--secondary-fg": theme.secondaryFg,
    "--accent": theme.accent,
    "--accent-fg": theme.accentFg,
    "--surface": theme.surface,
    "--surface-fg": theme.surfaceFg,
    "--border": theme.border,
    "--muted": theme.muted,
    "--muted-fg": theme.mutedFg,
    "--card": theme.card,
    "--card-fg": theme.cardFg,
    "--shadow": theme.shadow,
    "--nav-bg": theme.navBg,
    "--nav-border": theme.navBorder,
    "--dot-overlay": theme.dotOverlayColor,
  };
}

export { softwareTheme, aiTheme };
