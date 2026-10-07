import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7", className)}
      aria-hidden="true"
    >
      <path
        d="M8 26 L16 6 L24 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2 18.5 H20.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M6 8 C12 2, 20 2, 26 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function Logo({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <Link
      to="/"
      className={cn(
        "flex items-center gap-2.5 tracking-[0.22em]",
        inverted ? "text-paper" : "text-ink",
        className,
      )}
    >
      <Mark />
      <span className="font-display text-lg font-medium tracking-[0.28em]">AURÉLIA</span>
    </Link>
  );
}

export { Logo, Mark };
