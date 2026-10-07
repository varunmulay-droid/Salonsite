import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ImageFrame } from "@/components/media/image-frame";
import { useSalon } from "@/lib/booking-store";
import { looks } from "@/lib/salon-data";
import { Button } from "@/components/ui/button";

function LookLightbox() {
  const look = useSalon((s) => s.look);
  const setLook = useSalon((s) => s.setLook);
  const index = look ? looks.findIndex((l) => l.id === look.id) : -1;

  function step(dir: number) {
    if (index < 0) return;
    const next = looks[(index + dir + looks.length) % looks.length];
    if (next) setLook(next);
  }

  return (
    <Dialog open={!!look} onOpenChange={(open) => !open && setLook(null)}>
      <DialogContent className="overflow-hidden bg-ink p-0">
        {look ? (
          <>
            <DialogTitle className="sr-only">{look.title}</DialogTitle>
            <DialogDescription className="sr-only">{look.atelier}</DialogDescription>
            <ImageFrame src={look.image} alt={look.title} className="aspect-[4/5] max-h-[78vh] sm:aspect-[5/4]" />
            <div className="flex items-center justify-between gap-3 px-4 py-3 text-paper">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-bronze">{look.atelier}</p>
                <p className="font-display text-xl">{look.title}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-paper hover:bg-paper/10"
                  onClick={() => step(-1)}
                  aria-label="Previous look"
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-paper hover:bg-paper/10"
                  onClick={() => step(1)}
                  aria-label="Next look"
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export { LookLightbox };
