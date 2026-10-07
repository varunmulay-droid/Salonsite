import * as React from "react";
import { cn } from "@/lib/utils";

function ShimmerButton({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-ink px-6 text-sm font-medium text-paper transition-transform duration-150 active:not-disabled:scale-[0.96]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(110deg, transparent 20%, color-mix(in oklab, var(--color-bronze) 70%, white) 50%, transparent 80%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2.4s linear infinite",
        }}
      />
      <span className="relative">{children}</span>
    </button>
  );
}

export { ShimmerButton };
