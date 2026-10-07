import * as React from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  suffix = "",
  prefix = "",
}: {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  className?: string;
  decimalPlaces?: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, { damping: 48, stiffness: 90 });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  React.useEffect(() => {
    if (!isInView) return;
    const timer = window.setTimeout(() => {
      motionValue.set(direction === "down" ? 0 : value);
    }, delay * 1000);
    return () => window.clearTimeout(timer);
  }, [motionValue, isInView, delay, value, direction]);

  React.useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (!ref.current) return;
      ref.current.textContent = `${prefix}${Intl.NumberFormat("en-GB", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(Number(latest.toFixed(decimalPlaces)))}${suffix}`;
    });
    return unsubscribe;
  }, [springValue, decimalPlaces, suffix, prefix]);

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums tracking-tight", className)}
    >
      {prefix}
      {Intl.NumberFormat("en-GB", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(value)}
      {suffix}
    </span>
  );
}

export { NumberTicker };
