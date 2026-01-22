import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function Word({ children, range }) {
  const ref = useRef(null);
  // Track scroll progress of THIS specific word
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.5'], // Starts highlighting when word hits bottom 90%, finishes at 50% screen height
  });
  
  // Map scroll progress to opacity (0.1 = Dim, 1 = Bright)
  const opacity = useTransform(scrollYProgress, range, [0.15, 1]);

  return (
    <motion.span ref={ref} style={{ opacity }} className="inline-block mr-[0.25em] transition-colors duration-200">
      {children}
    </motion.span>
  );
}

export default function ScrollRevealText({ children, className = "" }) {
  const words = children.split(" ");
  return (
    <p className={`${className} flex flex-wrap leading-relaxed`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          // We pass a small range so words highlight sequentially
          <Word key={i} range={[0, 1]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}