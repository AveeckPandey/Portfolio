"use client";

import { useState } from "react";
import ParticleText from "./ParticleText";
import ScrambleText from "./ScrambleText";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Mobile phones get fewer dots (larger pixelStep → ~40% fewer
  // particles) and a smaller canvas, which keeps the rAF loop cheap.
  const isMobile = useIsMobile();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 py-24"
    >
      {/* Top-left corner badge — glassmorphism */}
      <div
        className="absolute left-6 top-6 z-10 inline-flex items-center gap-2 border-2 px-5 py-2.5 font-mono text-base font-bold uppercase tracking-[0.2em] md:left-10 md:top-10 md:px-6 md:py-3 md:text-2xl"
        style={{
          // Translucent cream so the painting shows through faintly,
          // blurred backdrop for the frosted feel, soft warm border
          // to replace the hard black, gentle drop shadow instead
          // of the offset neo-shadow.
          backgroundColor: "rgba(246, 232, 211, 0.45)",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
          borderColor: "rgba(23, 20, 17, 0.35)",
          color: "#171411",
          boxShadow:
            "0 8px 24px rgba(23, 20, 17, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.45)",
        }}
      >
        <span
          className="inline-block h-3 w-3 rounded-full animate-pulse"
          style={{ backgroundColor: "#9A5A25" }}
        /> <ScrambleText text="Connect with Aveeck Pandey" />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left column: small pill badge in the top-left, then particle
              heading + Book a Call below. */}
          <div className="flex flex-col items-center gap-6 md:pr-8">
            <ParticleText
              text="Let's build something unforgettable"
              fontSize={isMobile ? 64 : 88}
              pixelStep={isMobile ? 8 : 5}
              particleColor="#1a1a1a"
            />
            <p
              className="font-mono text-base text-center"
              style={{ color: "#171411" }}
            >
              Prefer to talk it through? Grab a slot on my calendar.
            </p>
            <a
              href="https://calendly.com/aveeckpandey/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-border neo-shadow inline-flex items-center gap-2 font-mono text-xs font-bold uppercase transition-all duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:neo-shadow-lg active:translate-x-[2px] active:translate-y-[2px] active:neo-shadow-sm"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--fg)",
                padding: "10px 16px",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Book a call
            </a>
          </div>

          {/* Right column: Contact form card — glassmorphism */}
          <div className="w-full">
            <div
              className="p-8"
              style={{
                // Frosted panel that lets the AI-hand painting bleed
                // through subtly. Soft warm border, inner highlight,
                // and a gentle outer shadow replace the offset
                // neo-shadow that no longer makes sense on glass.
                backgroundColor: "rgba(246, 232, 211, 0.45)",
                backdropFilter: "blur(18px) saturate(140%)",
                WebkitBackdropFilter: "blur(18px) saturate(140%)",
                border: "1px solid rgba(23, 20, 17, 0.18)",
                borderRadius: 4,
                color: "var(--card-fg)",
                boxShadow:
                  "0 12px 36px rgba(23, 20, 17, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
              }}
            >
              {submitted ? (
                <div className="py-4">
                  <p className="font-mono text-lg" style={{ color: "var(--accent)" }}>
                    Thank you! Your message has been sent.
                  </p>
                  <p className="mt-2 font-mono text-sm" style={{ color: "var(--muted-fg)" }}>
                    I&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <p className="mb-6 font-mono text-base leading-relaxed" style={{ color: "var(--muted-fg)" }}>
                    Fill out the form below and I&apos;ll get back to you.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1 block font-mono text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded border p-3 font-mono text-base outline-none focus:ring-2"
                        style={{
                          backgroundColor: "var(--surface)",
                          color: "var(--fg)",
                          borderColor: "var(--border)",
                          caretColor: "var(--accent)",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-mono text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded border p-3 font-mono text-base outline-none focus:ring-2"
                        style={{
                          backgroundColor: "var(--surface)",
                          color: "var(--fg)",
                          borderColor: "var(--border)",
                          caretColor: "var(--accent)",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-mono text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                        Message
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full rounded border p-3 font-mono text-base outline-none focus:ring-2"
                        style={{
                          backgroundColor: "var(--surface)",
                          color: "var(--fg)",
                          borderColor: "var(--border)",
                          caretColor: "var(--accent)",
                          resize: "vertical",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="neo-border neo-shadow inline-flex w-full items-center justify-center font-mono text-sm font-bold uppercase transition-all duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:neo-shadow-lg active:translate-x-[2px] active:translate-y-[2px] active:neo-shadow-sm"
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--primary-fg)",
                        padding: "14px 20px",
                        opacity: submitting ? 0.6 : 1,
                        cursor: submitting ? "not-allowed" : "pointer",
                      }}
                    >
                      {submitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}