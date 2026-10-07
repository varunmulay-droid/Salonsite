import * as React from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSalon } from "@/lib/booking-store";
import {
  artisans,
  formatDuration,
  formatPrice,
  houses,
  serviceBySlug,
  services,
  timeSlots,
} from "@/lib/salon-data";
import { cn } from "@/lib/utils";

const ANY = "any";

export function BookingForm({ compact = false }: { compact?: boolean }) {
  const prefillService = useSalon((s) => s.prefillService);
  const addAppointment = useSalon((s) => s.addAppointment);

  const [house, setHouse] = React.useState(houses[0]?.slug ?? "london");
  const [service, setService] = React.useState(prefillService ?? services[0]?.slug ?? "cut");
  const [artisan, setArtisan] = React.useState(ANY);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [time, setTime] = React.useState<string>("");
  const [windowHours, setWindowHours] = React.useState<number[]>([9, 18]);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (prefillService) setService(prefillService);
  }, [prefillService]);

  const selected = serviceBySlug(service);
  const filteredSlots = timeSlots.filter((slot) => {
    const hour = Number(slot.slice(0, 2));
    return hour >= windowHours[0] && hour <= windowHours[1];
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time || !name.trim() || !email.trim()) {
      toast.error("Please complete name, email, date, and time.");
      return;
    }
    const appointment = addAppointment({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      house,
      service,
      artisan,
      date: format(date, "yyyy-MM-dd"),
      time,
      notes: notes.trim(),
    });
    toast.success("Chair reserved", {
      description: `${format(date, "d MMMM")} at ${appointment.time} · ${houses.find((h) => h.slug === house)?.city}`,
    });
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setTime("");
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-5", compact ? "pb-8" : "pb-4")}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="House">
          <Select value={house} onValueChange={setHouse}>
            <SelectTrigger aria-label="House">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {houses.map((h) => (
                <SelectItem key={h.slug} value={h.slug}>
                  {h.city} · {h.neighbourhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Service">
          <Select value={service} onValueChange={setService}>
            <SelectTrigger aria-label="Service">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {selected ? (
        <p className="text-sm text-taupe">
          {formatDuration(selected.durationMin, selected.durationMax)} · from {formatPrice(selected.priceFrom)}
        </p>
      ) : null}

      <Field label="Artisan">
        <Select value={artisan} onValueChange={setArtisan}>
          <SelectTrigger aria-label="Artisan">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any director</SelectItem>
            {artisans.map((a) => (
              <SelectItem key={a.slug} value={a.slug}>
                {a.name} · {a.role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div>
        <Label>Date</Label>
        <div className="mt-2 rounded-xl bg-raised p-2 shadow-[var(--shadow-border)]">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={{ before: new Date() }}
          />
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between gap-4">
          <Label>Time window</Label>
          <p className="text-xs tabular-nums text-taupe">
            {String(windowHours[0]).padStart(2, "0")}:00 – {String(windowHours[1]).padStart(2, "0")}:00
          </p>
        </div>
        <Slider
          className="mt-3"
          min={9}
          max={18}
          step={1}
          value={windowHours}
          onValueChange={setWindowHours}
          aria-label="Preferred hours"
        />
      </div>

      <div>
        <Label>Time</Label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {filteredSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setTime(slot)}
              className={cn(
                "h-11 rounded-md border text-sm tabular-nums transition-colors duration-150",
                time === slot
                  ? "border-ink bg-ink text-paper"
                  : "border-border bg-raised text-ink hover:bg-sand",
              )}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </Field>
      </div>
      <Field label="Telephone">
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />
      </Field>
      <Field label="Notes">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Allergies, texture, the look you want held."
        />
      </Field>

      <Button type="submit" size="lg" className="mt-2 w-full">
        Confirm reservation
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
