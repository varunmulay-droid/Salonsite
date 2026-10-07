import * as React from "react";
import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageFrame } from "@/components/media/image-frame";
import { useSalon } from "@/lib/booking-store";
import { houses } from "@/lib/salon-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/houses")({ component: HousesPage });

function HousesPage() {
  const hash = useRouterState({ select: (s) => s.location.hash.replace("#", "") });
  const openBooking = useSalon((s) => s.openBooking);
  const [active, setActive] = React.useState(houses[0]?.slug ?? "london");

  React.useEffect(() => {
    if (hash && houses.some((h) => h.slug === hash)) setActive(hash);
  }, [hash]);

  const house = houses.find((h) => h.slug === active) ?? houses[0];

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-[11px] uppercase tracking-[0.2em] text-taupe">Houses</p>
      <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">Five cities. One floor.</h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-taupe">
        Each house keeps the same method, the same quiet, and a desk that answers in the morning.
      </p>
      <div className="mt-12 grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <ul className="divide-y divide-border border-y border-border">
            {houses.map((h) => (
              <li key={h.slug}>
                <button
                  type="button"
                  onClick={() => setActive(h.slug)}
                  className={cn(
                    "flex w-full items-center justify-between py-4 text-left transition-colors",
                    h.slug === active ? "text-ink" : "text-taupe hover:text-ink",
                  )}
                >
                  <span className="font-display text-2xl">{h.city}</span>
                  <span className="text-[11px] uppercase tracking-[0.16em]">{h.neighbourhood}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        {house ? (
          <div className="lg:col-span-8">
            <ImageFrame
              src={house.slug === "tokyo" || house.slug === "dubai" ? "/images/hero-spa.jpg" : "/images/service-colour.jpg"}
              alt={`${house.city} house`}
              className="aspect-[16/10] rounded-2xl"
            />
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="font-display text-4xl">
                  {house.city}
                  <span className="text-taupe"> · {house.neighbourhood}</span>
                </h2>
                <Button className="mt-6" onClick={() => openBooking()}>
                  Book {house.city}
                </Button>
              </div>
              <ul className="space-y-3 text-sm text-taupe">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  {house.address}
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0" />
                  {house.hours}
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0" />
                  {house.phone}
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0" />
                  {house.email}
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
