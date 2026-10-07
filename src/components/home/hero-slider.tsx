import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedShinyText } from "@/components/magic/animated-shiny-text";
import { useSalon } from "@/lib/booking-store";
import { cn } from "@/lib/utils";

const slides = [
  {
    image: "/images/hero-spa.jpg",
    kicker: "Five houses",
    title: "A quiet floor, everywhere.",
    caption: "Mayfair, Saint-Germain, West Village, DIFC, Aoyama.",
  },
  {
    image: "/images/service-colour.jpg",
    kicker: "Colour atelier",
    title: "Pigment, mixed by eye.",
    caption: "No stripes. No costume. Light, undertone, history.",
  },
  {
    image: "/images/service-cut.jpg",
    kicker: "Cut & form",
    title: "Architecture for the head.",
    caption: "Precision, weight, and the way the hair actually lives.",
  },
  {
    image: "/images/team-amara.jpg",
    kicker: "Artisans",
    title: "Directors who still take the chair.",
    caption: "Skin, colour, cut, and makeup — one method.",
  },
];

function HeroSlider() {
  const openBooking = useSalon((s) => s.openBooking);
  const autoplay = React.useRef(
    Autoplay({ delay: 6500, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 28 }, [autoplay.current]);
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

  const slide = slides[index] ?? slides[0];

  return (
    <section className="relative h-dvh min-h-[640px] overflow-hidden bg-ink text-paper">
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((item) => (
            <div key={item.title} className="relative min-w-0 flex-[0_0_100%]">
              <img
                src={item.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover animate-kenburns"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/25" />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end">
        <div className="pointer-events-auto mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-10 sm:px-6 sm:pb-14">
          <div className="stagger-in max-w-2xl">
            <AnimatedShinyText className="text-bronze">{slide.kicker}</AnimatedShinyText>
            <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight text-paper sm:text-6xl lg:text-7xl">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-md text-base text-paper/75">{slide.caption}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="inverse" size="lg" onClick={() => openBooking()}>
                Reserve a chair
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-paper/25 text-paper hover:bg-paper/10"
                asChild
              >
                <a href="#atelier">View the atelier</a>
              </Button>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-paper hover:bg-paper/10"
                aria-label="Previous slide"
                onClick={() => emblaApi?.scrollPrev()}
              >
                <ArrowLeft />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-paper hover:bg-paper/10"
                aria-label="Next slide"
                onClick={() => emblaApi?.scrollNext()}
              >
                <ArrowRight />
              </Button>
              <p className="font-display text-lg tabular-nums text-paper/80">
                {String(index + 1).padStart(2, "0")}
                <span className="text-paper/40"> / {String(slides.length).padStart(2, "0")}</span>
              </p>
            </div>
            <div className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-paper/60 sm:flex">
              <span>Scroll</span>
              <ArrowDown className="size-3.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { HeroSlider };
