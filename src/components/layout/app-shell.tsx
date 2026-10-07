import * as React from "react";
import { useRouterState } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { NavSheet } from "@/components/layout/nav-sheet";
import { BookingSheet } from "@/components/booking/booking-sheet";
import { LookLightbox } from "@/components/media/look-lightbox";
import { SalonChatbot } from "@/components/chat/SalonChatbot";
import { useSalon } from "@/lib/booking-store";
import { cn } from "@/lib/utils";

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hydrate = useSalon((s) => s.hydrate);

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <div className="grain" aria-hidden />
      <SiteHeader />
      <NavSheet />
      <BookingSheet />
      <LookLightbox />
      <SalonChatbot />
      <div className={cn(pathname === "/" ? "" : "pt-16 sm:pt-[4.5rem]")}>{children}</div>
      <SiteFooter />
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "font-sans",
          style: {
            background: "var(--color-ink)",
            color: "var(--color-paper)",
            border: "1px solid color-mix(in oklab, var(--color-paper) 12%, transparent)",
          },
        }}
      />
    </>
  );
}

export { AppShell };
