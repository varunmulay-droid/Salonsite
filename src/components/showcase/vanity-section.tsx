import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { BlurFade } from "@/components/magic/blur-fade";
import { Button } from "@/components/ui/button";
import { VanityViewer } from "@/components/showcase/vanity-viewer";
import { vanityHotspots } from "@/data/vanity";
import { openChat, trackChatEvent } from "@/lib/chatbot/events";
import { formatDuration, formatPrice, serviceBySlug } from "@/lib/salon-data";
import { cn } from "@/lib/utils";

export function VanitySection() {
  const [active, setActive] = React.useState<string | null>(null);
  const hotspot = vanityHotspots.find((h) => h.id === active);
  const service = hotspot ? serviceBySlug(hotspot.serviceSlug) : undefined;

  const select = React.useCallback((id: string | null) => {
    setActive(id);
    if (id) trackChatEvent("hotspot_selected", { hotspot: id });
  }, []);

  return (
    <section id="vanity" className="scroll-mt-20 border-y border-border bg-raised py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-14">
        <BlurFade>
          <VanityViewer active={active} onSelect={select} className="h-[26rem] sm:h-[34rem] lg:h-[38rem]" />
        </BlurFade>

        <BlurFade delay={0.08}>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-taupe">Inside the atelier</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">A chair, a mirror, a good light.</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-taupe">
            Turn the vanity, tap a point, and see the service that begins there. Ask the assistant about anything you like.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Parts of the vanity">
            {vanityHotspots.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  aria-pressed={active === h.id}
                  onClick={() => select(active === h.id ? null : h.id)}
                  className={cn(
                    "min-h-11 rounded-full border px-4 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active === h.id ? "border-ink bg-ink text-paper" : "border-border bg-paper hover:bg-sand",
                  )}
                >
                  {h.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 min-h-[13rem] rounded-2xl border border-border bg-paper p-5" aria-live="polite">
            {hotspot && service ? (
              <div key={hotspot.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-taupe">{hotspot.label}</p>
                <h3 className="mt-1 font-display text-2xl">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-taupe">{hotspot.blurb}</p>
                <p className="mt-3 text-xs tabular-nums">
                  From {formatPrice(service.priceFrom)} · {formatDuration(service.durationMin, service.durationMax)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => openChat(`svc:${service.slug}`, `Tell me about ${service.name}`)}>
                    <MessageCircle /> Ask the assistant
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/services/$slug" params={{ slug: service.slug }}>
                      View service <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-taupe">
                Select the mirror, the desk, the box, the drawer or the seat to see which of our services starts there.
              </p>
            )}
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
