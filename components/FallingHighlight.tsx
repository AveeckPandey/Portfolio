"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const YELLOW = "#D8A96B";

const fallingWords = [
  { text: "reliable", y: 16, rotate: -5 },
  { text: "AI", y: 22, rotate: 5 },
  { text: "products", y: 18, rotate: -3 },
];

export default function FallingHighlight() {
  const [isAssembled, setIsAssembled] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fallApart = () => {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
    setIsAssembled(false);
  };

  const reassemble = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setIsAssembled(true);
    resetTimer.current = setTimeout(fallApart, 2600);
  };

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  return (
    <span
      data-falling-highlight
      className="inline-flex min-h-[3.35rem] cursor-default items-start whitespace-nowrap align-top font-semibold"
      style={{ backgroundColor: YELLOW, padding: "0 7px" }}
      onPointerEnter={reassemble}
      onPointerLeave={fallApart}
    >
      {fallingWords.map((word, index) => (
        <motion.span
          key={word.text}
          className="inline-block origin-bottom"
          initial={{ y: word.y, rotate: word.rotate }}
          animate={isAssembled ? { y: 0, rotate: 0 } : { y: word.y, rotate: word.rotate }}
          transition={
            isAssembled
              ? {
                  type: "spring",
                  stiffness: 480,
                  damping: 17,
                  mass: 0.55,
                  delay: index * 0.025,
                }
              : {
                  type: "tween",
                  duration: 0.44,
                  delay: index * 0.05,
                  ease: "easeIn",
                }
          }
        >
          {word.text}
          {index < fallingWords.length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </span>
  );
}
