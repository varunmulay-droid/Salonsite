import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/layout/logo";
import { houses, navLinks, services } from "@/lib/salon-data";

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo inverted />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/70">
            A house of hair, skin, and quiet ritual. Founded in Mayfair, 2014 — now five floors, one method.
          </p>
        </div>
        <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-bronze">Visit</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-bronze">Atelier</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-paper">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-bronze">Houses</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              {houses.map((h) => (
                <li key={h.slug}>
                  <Link to="/houses" hash={h.slug} className="hover:text-paper">
                    {h.city}
                    <span className="text-paper/45"> · {h.neighbourhood}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[11px] uppercase tracking-[0.16em] text-paper/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Aurélia Maison</p>
          <p>By appointment · Five cities</p>
        </div>
      </div>
    </footer>
  );
}

export { SiteFooter };
