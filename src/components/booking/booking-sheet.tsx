import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BookingForm } from "@/components/booking/booking-form";
import { useSalon } from "@/lib/booking-store";

function BookingSheet() {
  const open = useSalon((s) => s.bookingOpen);
  const setOpen = useSalon((s) => s.setBookingOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="gap-0 p-0">
        <SheetHeader className="px-6 pt-16 pr-14 pb-4">
          <SheetTitle>Reserve a chair</SheetTitle>
          <SheetDescription>
            Choose a house, a service, and a time. Confirmation stays on this device until the desk writes back.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-8.5rem)] px-6">
          <BookingForm compact />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export { BookingSheet };
