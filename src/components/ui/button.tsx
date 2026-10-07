import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[var(--shadow-border)] hover:bg-ink/90",
        inverse:
          "bg-paper text-ink hover:bg-raised shadow-[var(--shadow-border)]",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-sand/60",
        secondary: "bg-secondary text-secondary-foreground hover:bg-sand",
        ghost: "hover:bg-sand/70 text-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        bronze: "bg-bronze text-ink hover:bg-bronze/90",
      },
      size: {
        default: "h-11 rounded-md px-4",
        sm: "h-9 rounded-sm px-3 text-xs tracking-wide",
        lg: "h-12 rounded-lg px-6",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

export { Button, buttonVariants };
