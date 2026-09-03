"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export default function Navbar() {
  const [active, setActive] = useState("#home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActive(href);
        setMobileOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    const sections = navLinks.map((l) => document.querySelector(l.href));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );

    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // The Projects section is pinned by GSAP ScrollTrigger for several
  // viewport-heights, so its bounding box never changes shape and
  // the IntersectionObserver above never sees the user move through
  // it. ScrollShowcase dispatches `portfolio:active-section` while
  // the pin is engaged; we listen for it and force `#projects`
  // active for the duration.
  useEffect(() => {
    const onSection = (e: Event) => {
      const detail = (e as CustomEvent<string | null>).detail;
      if (detail === "projects") {
        setActive("#projects");
      }
    };
    window.addEventListener("portfolio:active-section", onSection);
    return () => window.removeEventListener("portfolio:active-section", onSection);
  }, []);

  const lift = "transition-all duration-150 ease-out";
  const navText = "#D8C6AC";
  const navForeground = "#F6E8D3";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: "var(--nav-bg)",
        borderBottom: "1px solid var(--nav-border)",
        backdropFilter: "blur(16px) saturate(1.25)",
        WebkitBackdropFilter: "blur(16px) saturate(1.25)",
        boxShadow: "0 8px 28px rgba(13, 11, 9, 0.34), inset 0 1px 0 rgba(246, 232, 211, 0.08)",
        transition: "background-color 0.4s ease, border-color 0.4s ease",
      }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left: Logo + Brand */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="flex items-center gap-3"
        >
          <span
            className="neo-shadow flex h-[44px] w-[44px] items-center justify-center font-display text-sm font-bold"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-fg)",
            }}
          >
            AP
          </span>
          <span
            className="hidden font-mono text-[11px] font-bold uppercase sm:inline"
            style={{ letterSpacing: "0.15em", color: navForeground }}
          >
            AVEECK PANDEY
          </span>
        </a>

        {/* Center: Desktop Nav */}
        <ul className="hidden items-center md:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.href} className="mx-[7px]">
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`neo-border flex items-center px-3 py-2 font-mono text-xs font-semibold uppercase ${lift}`}
                  style={{
                    letterSpacing: "0.06em",
                    backgroundColor: isActive ? "var(--accent)" : "transparent",
                    color: isActive ? "var(--accent-fg)" : navText,
                    borderColor: isActive ? "var(--border)" : "transparent",
                    boxShadow: isActive ? "4px 4px 0 var(--shadow)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (isActive) return;
                    const el = e.currentTarget;
                    el.style.backgroundColor = "var(--accent)";
                    el.style.borderColor = "var(--border)";
                    el.style.color = "var(--accent-fg)";
                    el.style.boxShadow = "4px 4px 0 var(--shadow)";
                  }}
                  onMouseLeave={(e) => {
                    if (isActive) return;
                    const el = e.currentTarget;
                    el.style.backgroundColor = "transparent";
                    el.style.borderColor = "transparent";
                    el.style.color = "";
                    el.style.boxShadow = "none";
                  }}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right: Action Buttons */}
        <div className="hidden items-center md:flex" style={{ gap: "12px" }}>
          <a
            href="/assets/Software.pdf"
            download="Aveeck-Pandey-Resume.pdf"
            className="neo-border neo-shadow flex items-center font-mono text-xs font-bold uppercase hover:-translate-x-[2px] hover:-translate-y-[2px] hover:neo-shadow-lg active:translate-x-[2px] active:translate-y-[2px] active:neo-shadow-sm"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-fg)",
              padding: "10px 16px",
              gap: "8px",
              transition: "transform 150ms ease, box-shadow 150ms ease",
            }}
          >
            <Download size={14} />
            Resume
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="neo-border neo-shadow flex items-center font-mono text-xs font-bold uppercase text-white hover:-translate-x-[2px] hover:-translate-y-[2px] hover:neo-shadow-lg active:translate-x-[2px] active:translate-y-[2px] active:neo-shadow-sm"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-fg)",
              padding: "11px 18px",
              transition: "transform 150ms ease, box-shadow 150ms ease",
            }}
          >
            Contact Me
          </a>
        </div>

        {/* Mobile: Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="neo-border neo-shadow flex h-10 w-10 items-center justify-center md:hidden cursor-pointer"
          style={{ backgroundColor: "var(--surface)", color: navForeground }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="neo-border md:hidden"
          style={{
            backgroundColor: "var(--nav-bg)",
            borderTop: "none",
            backdropFilter: "blur(16px) saturate(1.25)",
            WebkitBackdropFilter: "blur(16px) saturate(1.25)",
            boxShadow: "0 8px 28px rgba(13, 11, 9, 0.34), inset 0 1px 0 rgba(246, 232, 211, 0.08)",
          }}
        >
          <ul className="flex flex-col px-6 py-4">
            {navLinks.map((link) => {
              const isActive = active === link.href;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="block py-3 font-mono text-sm font-semibold uppercase transition-colors"
                    style={{
                      letterSpacing: "0.08em",
                      backgroundColor: isActive ? "var(--accent)" : "transparent",
                      color: isActive ? "var(--accent-fg)" : navForeground,
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col px-6 pb-6" style={{ gap: "12px" }}>
            <a
              href="/assets/Software.pdf"
              download="Aveeck-Pandey-Resume.pdf"
              className="neo-border neo-shadow flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase"
              style={{ backgroundColor: "var(--secondary)", color: "var(--secondary-fg)", padding: "10px 16px" }}
            >
              <Download size={14} />
              Resume
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="neo-border neo-shadow flex items-center justify-center font-mono text-xs font-bold uppercase"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-fg)", padding: "11px 18px" }}
            >
              Contact Me
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
