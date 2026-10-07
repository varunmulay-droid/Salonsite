import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageFrame } from "@/components/media/image-frame";
import { useSalon } from "@/lib/booking-store";
import { looks } from "@/lib/salon-data";

export const Route = createFileRoute("/lookbook")({ component: LookbookPage });

function LookbookPage() {
  const setLook = useSalon((s) => s.setLook);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <main className="bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-[11px] uppercase tracking-[0.2em] text-bronze">Lookbook</p>
        <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h1 className="font-display text-5xl tracking-tight sm:text-6xl">Frames from the house.</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-paper hover:bg-paper/10"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous"
            >
              <ArrowLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-paper hover:bg-paper/10"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next"
            >
              <ArrowRight />
            </Button>
            <p className="font-display text-lg tabular-nums text-paper/70">
              {String(index + 1).padStart(2, "0")} / {String(looks.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>
      <div ref={emblaRef} className="overflow-hidden px-4 pb-10 sm:px-6">
        <div className="flex gap-4">
          {looks.map((look) => (
            <button
              key={look.id}
              type="button"
              onClick={() => setLook(look)}
              className="min-w-0 flex-[0_0_78%] text-left sm:flex-[0_0_42%] lg:flex-[0_0_28%]"
            >
              <ImageFrame src={look.image} alt={look.title} className="aspect-[3/4] rounded-xl" />
              <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-bronze">{look.atelier}</p>
              <p className="font-display text-2xl">{look.title}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-10 sm:grid-cols-4 sm:px-6 sm:py-16">
        {looks.map((look) => (
          <button key={`grid-${look.id}`} type="button" onClick={() => setLook(look)} className="text-left">
            <ImageFrame src={look.image} alt={look.title} className="aspect-square rounded-lg" />
          </button>
        ))}
      </div>
    </main>
  );
}
