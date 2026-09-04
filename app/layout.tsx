import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  Audiowide,
  Orbitron,
  Share_Tech_Mono,
  Cinzel,
  Cormorant_Garamond,
  Rubik_Mono_One,
} from "next/font/google";
import LowMotionBoot from "@/components/LowMotionBoot";
import "./globals.css";

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-audiowide",
  display: "swap",
});

const orbitron = Orbitron({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const sharetech = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sharetech",
  display: "swap",
});

/* Classical faces for the demo's folio aesthetic. Cinzel is the carved
   Roman-capital display; Cormorant Garamond is the italic-leaning text
   face that reads like a hand-set 16th-century book. */
const cinzel = Cinzel({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

/* Chunky mono display used for the demo's 3D-styled intro headline.
   Sits on the lavender intro backdrop before the classical folio
   scene takes over. */
const rubikMono = Rubik_Mono_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rubik-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio.buildwithaveeck.com"),
  title: "Aveeck Pandey — Software Engineer",
  description:
    "Software engineer specializing in full-stack development, backend systems, cloud infrastructure, APIs, and production software.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="software"
      className={`${audiowide.variable} ${orbitron.variable} ${sharetech.variable} ${cinzel.variable} ${cormorant.variable} ${rubikMono.variable}`}
    >
      <body>
        {/* SVG filter defs. Used via `filter: url(#id)` from CSS.
           - #paper-grunge: feTurbulence + feDisplacementMap that
             warps the underlying texture so highlights/scratches
             bend smoothly instead of standing out as harsh pixel
             dots. Applied to the body via a fixed background layer. */}
        <svg
          aria-hidden="true"
          focusable="false"
          width="0"
          height="0"
          style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        >
          <defs>
            <filter id="paper-grunge" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves="2"
                seed="7"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix
                in="noise"
                type="matrix"
                values="0 0 0 0 0.09
                        0 0 0 0 0.08
                        0 0 0 0 0.06
                        0 0 0 0.55 0"
                result="noise-tinted"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise-tinted"
                scale="2.2"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        {children}
        <LowMotionBoot />
        <SpeedInsights />
      </body>
    </html>
  );
}
