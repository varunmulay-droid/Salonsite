import { create } from "zustand";
import type { Look } from "@/lib/salon-data";

export type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  house: string;
  service: string;
  artisan: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
};

type SalonState = {
  bookingOpen: boolean;
  navOpen: boolean;
  look: Look | null;
  prefillService?: string;
  appointments: Appointment[];
  hydrated: boolean;
  setBookingOpen: (open: boolean) => void;
  openBooking: (service?: string) => void;
  setNavOpen: (open: boolean) => void;
  setLook: (look: Look | null) => void;
  hydrate: () => void;
  addAppointment: (input: Omit<Appointment, "id" | "createdAt">) => Appointment;
};

const STORAGE_KEY = "aurelia-appointments";

function readStored(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Appointment[]) : [];
  } catch {
    return [];
  }
}

export const useSalon = create<SalonState>((set, get) => ({
  bookingOpen: false,
  navOpen: false,
  look: null,
  appointments: [],
  hydrated: false,
  setBookingOpen: (bookingOpen) => set({ bookingOpen }),
  openBooking: (service) =>
    set({ bookingOpen: true, prefillService: service, navOpen: false }),
  setNavOpen: (navOpen) => set({ navOpen }),
  setLook: (look) => set({ look }),
  hydrate: () => {
    if (get().hydrated) return;
    set({ appointments: readStored(), hydrated: true });
  },
  addAppointment: (input) => {
    const appointment: Appointment = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const appointments = [appointment, ...get().appointments];
    set({ appointments, bookingOpen: false });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    }
    return appointment;
  },
}));
