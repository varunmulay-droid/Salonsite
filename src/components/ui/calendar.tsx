import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-3",
        month_caption: "flex justify-center pt-1 relative items-center h-10",
        caption_label: "font-display text-lg",
        nav: "flex items-center gap-1",
        button_previous:
          "absolute left-1 top-1 inline-flex size-9 items-center justify-center rounded-md hover:bg-sand",
        button_next:
          "absolute right-1 top-1 inline-flex size-9 items-center justify-center rounded-md hover:bg-sand",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-taupe w-9 text-[10px] uppercase tracking-[0.16em] font-medium",
        week: "flex w-full mt-1",
        day: "relative p-0 text-center text-sm",
        day_button:
          "size-9 rounded-md hover:bg-sand aria-selected:bg-ink aria-selected:text-paper transition-colors duration-150",
        selected: "bg-ink text-paper rounded-md",
        today: "font-medium",
        outside: "text-taupe/50",
        disabled: "text-taupe/30 opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
