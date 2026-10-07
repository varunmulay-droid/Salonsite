import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useSalon } from "@/lib/booking-store";
import { houses, navLinks, services } from "@/lib/salon-data";

function NavSheet() {
  const open = useSalon((s) => s.navOpen);
  const setNavOpen = useSalon((s) => s.setNavOpen);
  const openBooking = useSalon((s) => s.openBooking);

  return (
    <Sheet open={open} onOpenChange={setNavOpen}>
      <SheetContent
        side="left"
        className="border-r border-border bg-paper p-0"
        aria-describedby={undefined}
      >
        <SheetHeader className="px-6 pt-16 pr-14">
          <SheetTitle className="font-display text-4xl tracking-tight">The house</SheetTitle>
          <SheetDescription>Hair, skin, and quiet ritual — five cities.</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-6 pt-8" aria-label="Menu">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setNavOpen(false)}
              className="font-display text-3xl leading-tight text-ink transition-colors hover:text-taupe"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pt-8">
          <Button className="w-full" onClick={() => openBooking()}>
            Reserve a chair
          </Button>
        </div>
        <Separator className="mt-10" />
        <div className="grid gap-8 px-6 py-8 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-taupe">Atelier</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    onClick={() => setNavOpen(false)}
                    className="text-ink/80 hover:text-ink"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-taupe">Houses</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {houses.map((h) => (
                <li key={h.slug}>
                  <Link to="/houses" hash={h.slug} onClick={() => setNavOpen(false)} className="text-ink/80 hover:text-ink">
                    {h.city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { NavSheet };
