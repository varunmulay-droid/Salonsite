import * as React from "react";
import { cn } from "@/lib/utils";

type ShineBorderProps = React.ComponentProps<"div"> & {
  borderWidth?: number;
  duration?: number;
  shineColor?: string | string[];
};

function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "var(--color-bronze)",
  className,
  children,
  ...props
}: ShineBorderProps) {
  const colors = Array.isArray(shineColor) ? shineColor.join(",") : shineColor;
  return (
    <div
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,
        } as React.CSSProperties
      }
      className={cn("relative rounded-[inherit]", className)}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] [padding:var(--border-width)]"
        style={{
          backgroundImage: `radial-gradient(transparent, transparent, ${colors}, transparent, transparent)`,
          backgroundSize: "300% 300%",
          animation: "shine var(--duration) infinite linear",
        }}
      />
      {children}
    </div>
  );
}

export { ShineBorder };
