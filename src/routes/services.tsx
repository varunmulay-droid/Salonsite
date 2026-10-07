import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlurFade } from "@/components/magic/blur-fade";
import { ImageFrame } from "@/components/media/image-frame";
import { useSalon } from "@/lib/booking-store";
import { formatDuration, formatPrice, services } from "@/lib/salon-data";

export const Route = createFileRoute("/services")({ component: ServicesPage });

const ateliers = ["All", "Hair", "Face", "Hands", "Body", "Occasions"] as const;

function ServicesPage() {
  const openBooking = useSalon((s) => s.openBooking);
  const [atelier, setAtelier] = React.useState<(typeof ateliers)[number]>("All");
  const [duration, setDuration] = React.useState<number[]>([30, 360]);

  const filtered = services.filter((s) => {
    const inAtelier = atelier === "All" || s.atelier === atelier;
    const inDuration = s.durationMin >= duration[0] && s.durationMin <= duration[1];
    return inAtelier && inDuration;
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-taupe">Atelier</p>
      <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">The menu.</h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-taupe">
        Filter by room and how long you can sit. Prices start from the Mayfair book; other houses convert locally.
      </p>

      <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <Tabs value={atelier} onValueChange={(v) => setAtelier(v as (typeof ateliers)[number])}>
          <TabsList className="flex h-auto flex-wrap bg-transparent p-0">
            {ateliers.map((a) => (
              <TabsTrigger
                key={a}
                value={a}
                className="rounded-full data-[state=active]:bg-ink data-[state=active]:text-paper"
              >
                {a}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-[11px] uppercase tracking-[0.16em] text-taupe">
            <span>Duration</span>
            <span className="tabular-nums">
              {duration[0]}–{duration[1]} min
            </span>
          </div>
          <Slider min={30} max={360} step={15} value={duration} onValueChange={setDuration} className="mt-3" />
        </div>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {filtered.map((service, i) => (
          <BlurFade key={service.slug} delay={0.04 * i}>
            <article className="overflow-hidden rounded-2xl bg-raised p-2 shadow-[var(--shadow-border)]">
              <Link to="/services/$slug" params={{ slug: service.slug }} className="block">
                <ImageFrame src={service.image} alt={service.name} className="aspect-[16/10] rounded-xl" />
              </Link>
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Badge variant="bronze">{service.atelier}</Badge>
                  <h2 className="mt-2 font-display text-3xl leading-tight">{service.name}</h2>
                  <p className="mt-1 text-sm text-taupe">{service.summary}</p>
                  <p className="mt-2 text-xs tabular-nums text-taupe">
                    {formatDuration(service.durationMin, service.durationMax)} · from {formatPrice(service.priceFrom)}
                  </p>
                </div>
                <Button size="sm" onClick={() => openBooking(service.slug)}>
                  Reserve
                </Button>
              </div>
            </article>
          </BlurFade>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-taupe">No services in that window. Widen the slider.</p>
      ) : null}
    </main>
  );
}
