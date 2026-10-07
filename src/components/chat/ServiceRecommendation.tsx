import { formatDuration, formatPrice, serviceBySlug } from "@/lib/salon-data";

export function ServiceRecommendation({
  slug,
  onView,
  onEnquire,
}: {
  slug: string;
  onView: (slug: string) => void;
  onEnquire: (slug: string) => void;
}) {
  const s = serviceBySlug(slug);
  if (!s) return null;
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-raised shadow-[var(--shadow-border)]">
      <img
        src={s.image}
        alt=""
        loading="lazy"
        width={400}
        height={200}
        className="h-28 w-full object-cover"
      />
      <div className="space-y-1 p-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-taupe">{s.atelier}</p>
        <h3 className="font-display text-xl leading-tight">{s.name}</h3>
        <p className="text-xs leading-relaxed text-taupe">{s.summary}</p>
        <p className="pt-1 text-xs tabular-nums text-ink">
          From {formatPrice(s.priceFrom)} · {formatDuration(s.durationMin, s.durationMax)}
        </p>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={() => onView(slug)}
            className="min-h-11 rounded-md border border-border text-xs font-medium tracking-wide transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onEnquire(slug)}
            className="min-h-11 rounded-md bg-ink text-xs font-medium tracking-wide text-paper transition-colors hover:bg-ink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Enquire
          </button>
        </div>
      </div>
    </article>
  );
}
