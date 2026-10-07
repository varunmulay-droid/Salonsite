import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageFrame } from "@/components/media/image-frame";
import { BlurFade } from "@/components/magic/blur-fade";
import { useSalon } from "@/lib/booking-store";
import { artisans } from "@/lib/salon-data";

export const Route = createFileRoute("/atelier")({ component: AtelierPage });

function AtelierPage() {
  const openBooking = useSalon((s) => s.openBooking);

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-[11px] uppercase tracking-[0.2em] text-taupe">Artisans</p>
      <h1 className="mt-3 max-w-2xl font-display text-5xl tracking-tight sm:text-6xl">
        Directors who still take the chair.
      </h1>
      <p className="mt-5 max-w-lg text-sm leading-relaxed text-taupe">
        Each house is led from the floor. You can request a director when you reserve — or let the desk place you.
      </p>
      <div className="mt-14 grid gap-12">
        {artisans.map((a, i) => (
          <BlurFade key={a.slug} delay={0.05 * i}>
            <article className="grid items-center gap-8 lg:grid-cols-2">
              <ImageFrame
                src={a.image}
                alt={a.name}
                className={i % 2 === 1 ? "aspect-[4/5] rounded-2xl lg:order-2" : "aspect-[4/5] rounded-2xl"}
              />
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <Badge variant="bronze">
                  {a.role} · {a.house}
                </Badge>
                <h2 className="mt-4 font-display text-4xl">{a.name}</h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-taupe">{a.bio}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {a.specialties.map((s) => (
                    <li key={s}>
                      <Badge>{s}</Badge>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8" onClick={() => openBooking()}>
                  Request {a.name.split(" ")[0]}
                </Button>
              </div>
            </article>
          </BlurFade>
        ))}
      </div>
    </main>
  );
}
