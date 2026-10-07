import { cn } from "@/lib/utils";

function BorderBeam({
  className,
  size = 80,
  duration = 8,
  delay = 0,
  colorFrom = "var(--color-bronze)",
  colorTo = "var(--color-ink)",
}: {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--delay": `-${delay}s`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] [border:1px_solid_transparent]",
        className,
      )}
    >
      <div
        className="absolute aspect-square"
        style={{
          width: "var(--size)",
          offsetPath: `rect(0 auto auto 0 round calc(var(--size) * 1px))`,
          background: "linear-gradient(to left, var(--color-from), var(--color-to), transparent)",
          animation: "border-beam calc(var(--duration) * 1s) infinite linear",
          animationDelay: "var(--delay)",
        }}
      />
    </div>
  );
}

export { BorderBeam };
