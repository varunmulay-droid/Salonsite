import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ink text-paper",
        bronze: "border-transparent bg-bronze/30 text-ink",
        outline: "border-border text-taupe",
        paper: "border-transparent bg-paper/80 text-ink",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
