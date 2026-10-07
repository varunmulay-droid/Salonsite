import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { useSalon } from "@/lib/booking-store";
import { navLinks } from "@/lib/salon-data";
import { cn } from "@/lib/utils";

function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = React.useState(false);
  const setNavOpen = useSalon((s) => s.setNavOpen);
  const openBooking = useSalon((s) => s.openBooking);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overlay = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,color,box-shadow] duration-250",
        overlay
          ? "bg-transparent text-paper"
          : "bg-paper/92 text-ink shadow-[0_1px_0_0_var(--border)] backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6">
        <Logo inverted={overlay} />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-[11px] font-medium uppercase tracking-[0.18em] transition-opacity duration-150 hover:opacity-70",
                pathname.startsWith(link.href) && link.href !== "/" ? "opacity-100" : "opacity-80",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant={overlay ? "inverse" : "default"}
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => openBooking()}
          >
            Reserve
          </Button>
          <Button
            variant={overlay ? "ghost" : "ghost"}
            size="icon"
            aria-label="Open menu"
            className={cn(overlay && "text-paper hover:bg-paper/10")}
            onClick={() => setNavOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export { SiteHeader };
