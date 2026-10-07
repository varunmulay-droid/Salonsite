import * as React from "react";
import { cn } from "@/lib/utils";

function AnimatedShinyText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] font-medium uppercase tracking-[0.22em] text-taupe",
        className,
      )}
    >
      <span
        className="bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(110deg, var(--color-taupe) 35%, var(--color-ink) 50%, var(--color-taupe) 65%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 3.2s linear infinite",
          WebkitBackgroundClip: "text",
        }}
      >
        {children}
      </span>
    </span>
  );
}

export { AnimatedShinyText };
