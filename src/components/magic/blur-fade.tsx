import * as React from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

function BlurFade({
  children,
  className,
  delay = 0,
  offset = 8,
  blur = "4px",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  offset?: number;
  blur?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ y: offset, opacity: 0, filter: `blur(${blur})` }}
      animate={inView ? { y: 0, opacity: 1, filter: "blur(0px)" } : undefined}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export { BlurFade };
