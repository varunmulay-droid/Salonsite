import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageFrame } from "@/components/media/image-frame";
import { useSalon } from "@/lib/booking-store";
import { formatDuration, formatPrice, serviceBySlug, services } from "@/lib/salon-data";

export const Route = createFileRoute("/services/$slug")({
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const service = serviceBySlug(slug);
  const openBooking = useSalon((s) => s.openBooking);
  if (!service) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Service not on the menu.</h1>
        <Button className="mt-8" asChild>
          <Link to="/services">Back to atelier</Link>
        </Button>
      </main>
    );
  }

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <main>
      <div className="grid lg:grid-cols-2">
        <ImageFrame src={service.image} alt={service.name} className="aspect-[4/5] lg:min-h-[70vh]" />
        <div className="flex flex-col justify-center px-4 py-12 sm:px-10 lg:px-16">
          <Badge variant="bronze">{service.atelier}</Badge>
          <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">{service.name}</h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-taupe">{service.description}</p>
          <p className="mt-6 text-sm tabular-nums text-ink">
            {formatDuration(service.durationMin, service.durationMax)} · from {formatPrice(service.priceFrom)}
          </p>
          <ol className="mt-8 space-y-3">
            {service.rituals.map((step, i) => (
              <li key={step} className="flex gap-4 text-sm">
                <span className="font-display text-lg tabular-nums text-bronze">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => openBooking(service.slug)}>
              Reserve this service
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/services">All ateliers</Link>
            </Button>
          </div>
        </div>
      </div>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-taupe">Also on the floor</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {related.map((s) => (
            <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="group">
              <ImageFrame src={s.image} alt={s.name} className="aspect-[4/3] rounded-xl" />
              <h2 className="mt-3 font-display text-2xl">{s.name}</h2>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
