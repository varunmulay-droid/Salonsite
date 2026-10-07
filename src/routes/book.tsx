import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { BookingForm } from "@/components/booking/booking-form";
import { useSalon } from "@/lib/booking-store";
import { artisans, houses, services } from "@/lib/salon-data";

export const Route = createFileRoute("/book")({ component: BookPage });

function BookPage() {
  const appointments = useSalon((s) => s.appointments);

  return (
    <main className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="text-[11px] uppercase tracking-[0.2em] text-taupe">Reservations</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">The book.</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-taupe">
          Choose a house and a time. Your request is kept on this device until the desk confirms.
        </p>
        <div className="mt-10 rounded-2xl bg-raised p-4 shadow-[var(--shadow-border)] sm:p-6">
          <BookingForm />
        </div>
      </div>
      <aside className="lg:col-span-5">
        <h2 className="font-display text-3xl">Your chair</h2>
        {appointments.length === 0 ? (
          <p className="mt-4 text-sm text-taupe">No reservations yet. The form on the left is the whole process.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {appointments.map((a) => {
              const house = houses.find((h) => h.slug === a.house);
              const service = services.find((s) => s.slug === a.service);
              const artisan = artisans.find((x) => x.slug === a.artisan);
              return (
                <li key={a.id} className="rounded-xl bg-paper p-4 shadow-[var(--shadow-border)]">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-taupe">
                    {house?.city} · {service?.name}
                  </p>
                  <p className="mt-1 font-display text-2xl">
                    {format(parseISO(a.date), "d MMMM")} · {a.time}
                  </p>
                  <p className="mt-1 text-sm text-taupe">
                    {a.name}
                    {artisan ? ` · ${artisan.name}` : ""}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </main>
  );
}
