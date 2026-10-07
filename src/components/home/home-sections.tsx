import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Marquee } from "@/components/magic/marquee";
import { NumberTicker } from "@/components/magic/number-ticker";
import { BlurFade } from "@/components/magic/blur-fade";
import { ShineBorder } from "@/components/magic/shine-border";
import { BorderBeam } from "@/components/magic/border-beam";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ImageFrame } from "@/components/media/image-frame";
import { useSalon } from "@/lib/booking-store";
import {
  artisans,
  faqs,
  formatDuration,
  formatPrice,
  HOUSE_FOUNDING,
  looks,
  services,
  testimonials,
} from "@/lib/salon-data";
import { cn } from "@/lib/utils";

export function ServicesMarquee() {
  return (
    <div className="border-y border-border bg-raised py-4">
      <Marquee pauseOnHover className="[--duration:36s]">
        {services.map((s) => (
          <Link
            key={s.slug}
            to="/services/$slug"
            params={{ slug: s.slug }}
            className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.22em] text-taupe hover:text-ink"
          >
            <span className="size-1 rounded-full bg-bronze" />
            {s.name}
          </Link>
        ))}
      </Marquee>
    </div>
  );
}

export function StatsRow() {
  const stats = [
    { value: 5, label: "Houses" },
    { value: 40, label: "Artisans" },
    { value: HOUSE_FOUNDING, label: "Founded" },
    { value: 8, label: "Ateliers" },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-10 sm:px-8 sm:py-12">
            <p className="font-display text-4xl tracking-tight sm:text-5xl">
              <NumberTicker value={stat.value} />
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-taupe">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ServicesBento() {
  const openBooking = useSalon((s) => s.openBooking);
  return (
    <section id="atelier" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <BlurFade>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-taupe">The atelier</p>
        <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-xl font-display text-4xl tracking-tight sm:text-5xl">
            Eight rooms. One method.
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-taupe">
            Hair, skin, hands, and the long day. Every service starts with a reading — never a catalogue number.
          </p>
        </div>
      </BlurFade>
      <div className="mt-12 grid gap-4 md:grid-cols-6">
        {services.map((service, i) => {
          const wide = i === 0 || i === 3 || i === 6;
          return (
            <BlurFade key={service.slug} delay={0.04 * i} className={wide ? "md:col-span-3" : "md:col-span-3 lg:col-span-2"}>
              <Link
                to="/services/$slug"
                params={{ slug: service.slug }}
                className="group relative block overflow-hidden rounded-2xl bg-raised p-2 shadow-[var(--shadow-border)] transition-[box-shadow] duration-250 hover:shadow-[var(--shadow-border-hover)]"
              >
                {i === 0 ? <BorderBeam duration={9} /> : null}
                <ImageFrame
                  src={service.image}
                  alt={service.name}
                  className={cn("rounded-xl", wide ? "aspect-[16/10]" : "aspect-[4/3]")}
                />
                <div className="flex items-end justify-between gap-3 p-4">
                  <div>
                    <Badge variant="bronze">{service.atelier}</Badge>
                    <h3 className="mt-2 font-display text-2xl leading-tight">{service.name}</h3>
                    <p className="mt-1 text-sm text-taupe">{service.summary}</p>
                  </div>
                  <p className="shrink-0 text-xs tabular-nums text-taupe">
                    {formatPrice(service.priceFrom)}
                  </p>
                </div>
              </Link>
            </BlurFade>
          );
        })}
      </div>
      <div className="mt-10 flex justify-center">
        <Button variant="outline" onClick={() => openBooking()}>
          Reserve from the menu
        </Button>
      </div>
    </section>
  );
}

export function LookbookRail() {
  const setLook = useSalon((s) => s.setLook);
  return (
    <section className="bg-ink py-20 text-paper sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-bronze">Lookbook</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">The floor, as it is.</h2>
          </div>
          <Button variant="ghost" className="text-paper hover:bg-paper/10" asChild>
            <Link to="/lookbook">
              All frames <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6">
        {looks.map((look) => (
          <button
            key={look.id}
            type="button"
            onClick={() => setLook(look)}
            className="w-[min(78vw,320px)] shrink-0 snap-start text-left"
          >
            <ImageFrame src={look.image} alt={look.title} className="aspect-[3/4] rounded-xl" />
            <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-bronze">{look.atelier}</p>
            <p className="font-display text-xl">{look.title}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export function TeamStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-taupe">Artisans</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">Directors of the floor.</h2>
        </div>
        <Button variant="outline" asChild>
          <Link to="/atelier">Meet the atelier</Link>
        </Button>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {artisans.map((a, i) => (
          <BlurFade key={a.slug} delay={0.05 * i}>
            <article className="group">
              <ImageFrame src={a.image} alt={a.name} className="aspect-[3/4] rounded-2xl" />
              <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-taupe">
                {a.role} · {a.house}
              </p>
              <h3 className="font-display text-2xl">{a.name}</h3>
            </article>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="border-y border-border bg-raised py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-taupe">Guests</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">After the chair.</h2>
      </div>
      <Marquee pauseOnHover className="mt-10 [--duration:50s]">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="w-[min(86vw,420px)] rounded-2xl bg-paper p-6 shadow-[var(--shadow-border)]"
          >
            <blockquote className="font-display text-2xl leading-snug text-ink">“{t.quote}”</blockquote>
            <figcaption className="mt-5 text-sm text-taupe">
              {t.name} · {t.house} · {t.service}
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  );
}

export function FaqCta() {
  const openBooking = useSalon((s) => s.openBooking);
  return (
    <section className="mx-auto grid max-w-7xl gap-16 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-taupe">Before you come</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">The quiet rules.</h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-taupe">
          Appointments only. Colour and bridal begin with a consult. We keep the floor unhurried on purpose.
        </p>
        <ShineBorder className="mt-10 overflow-hidden rounded-2xl bg-ink p-8 text-paper">
          <p className="text-[11px] uppercase tracking-[0.18em] text-bronze">Next chair</p>
          <p className="mt-3 font-display text-3xl leading-tight">Reserve from any house, any atelier.</p>
          <Button variant="inverse" className="mt-6" onClick={() => openBooking()}>
            Open the book
          </Button>
        </ShineBorder>
      </div>
      <div className="lg:col-span-7">
        <Accordion type="single" collapsible>
          {faqs.map((item, i) => (
            <AccordionItem key={item.q} value={`q-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function FeaturedPrices() {
  return (
    <section className="sr-only">
      {services.map((s) => (
        <p key={s.slug}>
          {s.name} {formatDuration(s.durationMin, s.durationMax)}
        </p>
      ))}
    </section>
  );
}
