export type Service = {
  slug: string;
  name: string;
  atelier: string;
  summary: string;
  description: string;
  durationMin: number;
  durationMax: number;
  priceFrom: number;
  image: string;
  rituals: string[];
};

export type House = {
  slug: string;
  city: string;
  neighbourhood: string;
  address: string;
  hours: string;
  phone: string;
  email: string;
};

export type Artisan = {
  slug: string;
  name: string;
  role: string;
  house: string;
  bio: string;
  image: string;
  specialties: string[];
};

export type Look = {
  id: string;
  title: string;
  atelier: string;
  image: string;
};

export const HOUSE_NAME = "Aurélia";
export const HOUSE_TAGLINE = "Beauty, composed.";
export const HOUSE_FOUNDING = 2014;

export const services: Service[] = [
  {
    slug: "cut",
    name: "Cut & Form",
    atelier: "Hair",
    summary: "Architecture for the head. Precision, weight, and movement.",
    description:
      "A consultation, then a cut composed to the bone structure and the way the hair actually lives. We work wet and dry, finish with a tailored form, and never rush the last ten minutes.",
    durationMin: 60,
    durationMax: 90,
    priceFrom: 95,
    image: "/images/service-cut.jpg",
    rituals: ["Consultation & map", "Precision cut", "Form & finish", "Home care"],
  },
  {
    slug: "colour",
    name: "Colour Atelier",
    atelier: "Hair",
    summary: "Pigment as couture. Quiet shifts, never a costume.",
    description:
      "We mix in small bowls, strand by strand. Balayage, gloss, and corrective work are treated as the same craft: light, undertone, and the hair’s history. Nothing is rushed onto a formula card.",
    durationMin: 120,
    durationMax: 240,
    priceFrom: 160,
    image: "/images/service-colour.jpg",
    rituals: ["Undertone reading", "Custom mix", "Canvas & process", "Seal & gloss"],
  },
  {
    slug: "nails",
    name: "Nail Couture",
    atelier: "Hands",
    summary: "Shape, shine, and a nude that actually matches the skin.",
    description:
      "Manicure and pedicure as a slow, exacting service. We shape to the hand, not the trend, and finish with breathable nudes, deep espresso, or a single champagne foil.",
    durationMin: 45,
    durationMax: 75,
    priceFrom: 55,
    image: "/images/service-nails.jpg",
    rituals: ["Soak & assess", "Shape & care", "Colour or buff", "Oil seal"],
  },
  {
    slug: "skin",
    name: "Skin Rituals",
    atelier: "Face",
    summary: "Facials that treat the barrier first, glow second.",
    description:
      "A diagnostic facial built around the skin in front of us. Lymphatic work, enzymes, and a measured peel when it is earned. You leave quiet, not pink.",
    durationMin: 60,
    durationMax: 90,
    priceFrom: 140,
    image: "/images/service-skin.jpg",
    rituals: ["Barrier read", "Cleanse & extract", "Treatment", "Seal & rest"],
  },
  {
    slug: "makeup",
    name: "Makeup Studio",
    atelier: "Face",
    summary: "Skin, not mask. For daylight, dusk, and the photograph.",
    description:
      "Editorial makeup for events, campaigns, and the days that need a little more architecture. We match undertone in north light and teach the five-minute version you can repeat.",
    durationMin: 45,
    durationMax: 90,
    priceFrom: 85,
    image: "/images/service-makeup.jpg",
    rituals: ["Undertone match", "Skin first", "Form & feature", "Set & lesson"],
  },
  {
    slug: "brows",
    name: "Brow & Lash",
    atelier: "Face",
    summary: "The frame of the face, drawn with a very sharp pencil.",
    description:
      "Brow architecture, lash lift, and tint. We map to the orbital bone and leave the expression intact. No over-drawn arches, no cartoon lashes.",
    durationMin: 30,
    durationMax: 60,
    priceFrom: 45,
    image: "/images/service-brows.jpg",
    rituals: ["Bone map", "Sculpt or lift", "Tint", "Groom"],
  },
  {
    slug: "body",
    name: "Body Spa",
    atelier: "Body",
    summary: "Heat, pressure, and silence in a closed room.",
    description:
      "A ninety-minute body ritual: warm oil, measured pressure, and a room that stays dark. We work the back, scalp, and feet as one circuit, not a menu of add-ons.",
    durationMin: 75,
    durationMax: 120,
    priceFrom: 170,
    image: "/images/hero-spa.jpg",
    rituals: ["Warmth", "Oil circuit", "Pressure", "Rest"],
  },
  {
    slug: "bridal",
    name: "Bridal Maison",
    atelier: "Occasions",
    summary: "Hair, skin, and makeup composed for a single long day.",
    description:
      "Trials months ahead, a morning that starts on time, and a look that photographs at noon and still holds at midnight. We travel to the house, the hotel, or work from the atelier.",
    durationMin: 180,
    durationMax: 360,
    priceFrom: 450,
    image: "/images/service-makeup.jpg",
    rituals: ["Trial", "Timeline", "Hair & skin", "Makeup & hold"],
  },
];

export const houses: House[] = [
  {
    slug: "london",
    city: "London",
    neighbourhood: "Mayfair",
    address: "14 Mount Street, W1K 2RR",
    hours: "Tue–Sat, 09:00–19:00",
    phone: "+44 20 7499 1400",
    email: "mayfair@aurelia.house",
  },
  {
    slug: "paris",
    city: "Paris",
    neighbourhood: "Saint-Germain",
    address: "8 Rue de Furstemberg, 75006",
    hours: "Tue–Sat, 10:00–19:00",
    phone: "+33 1 42 22 18 40",
    email: "paris@aurelia.house",
  },
  {
    slug: "new-york",
    city: "New York",
    neighbourhood: "West Village",
    address: "41 Perry Street, NY 10014",
    hours: "Tue–Sat, 09:00–20:00",
    phone: "+1 212 924 0140",
    email: "newyork@aurelia.house",
  },
  {
    slug: "dubai",
    city: "Dubai",
    neighbourhood: "DIFC",
    address: "Gate Village 7, DIFC",
    hours: "Sat–Thu, 10:00–20:00",
    phone: "+971 4 323 1400",
    email: "dubai@aurelia.house",
  },
  {
    slug: "tokyo",
    city: "Tokyo",
    neighbourhood: "Aoyama",
    address: "5-4-21 Minami-Aoyama, Minato",
    hours: "Wed–Sun, 10:00–19:00",
    phone: "+81 3 3406 1400",
    email: "tokyo@aurelia.house",
  },
];

export const artisans: Artisan[] = [
  {
    slug: "amara-diallo",
    name: "Amara Diallo",
    role: "Skin Director",
    house: "London",
    bio: "Trained in Paris and Dakar. Treats the barrier as architecture, not a trend. Leads every facial protocol across the five houses.",
    image: "/images/team-amara.jpg",
    specialties: ["Skin Rituals", "Bridal"],
  },
  {
    slug: "isla-moreau",
    name: "Isla Moreau",
    role: "Colour Director",
    house: "Paris",
    bio: "A decade of corrective colour for editorial hair. Mixes by eye, never by swatch book. Known for quiet blondes and chestnut that still looks like hair.",
    image: "/images/service-colour.jpg",
    specialties: ["Colour Atelier", "Cut & Form"],
  },
  {
    slug: "kenji-arai",
    name: "Kenji Arai",
    role: "Cut Director",
    house: "Tokyo",
    bio: "Precision cutting with a dry-finish method. Builds form from the crown down so the hair falls, rather than being forced.",
    image: "/images/service-cut.jpg",
    specialties: ["Cut & Form", "Bridal"],
  },
  {
    slug: "mateo-ruiz",
    name: "Mateo Ruiz",
    role: "Makeup Director",
    house: "New York",
    bio: "Campaign and bridal work that starts with skin. Teaches a five-minute face that still photographs.",
    image: "/images/service-makeup.jpg",
    specialties: ["Makeup Studio", "Brow & Lash"],
  },
];

export const looks: Look[] = [
  { id: "spa", title: "The dark room", atelier: "Body", image: "/images/hero-spa.jpg" },
  { id: "cut", title: "Shears, rest", atelier: "Cut", image: "/images/service-cut.jpg" },
  { id: "colour", title: "Bowls of pigment", atelier: "Colour", image: "/images/service-colour.jpg" },
  { id: "nails", title: "Nude, matched", atelier: "Hands", image: "/images/service-nails.jpg" },
  { id: "skin", title: "Oil and stone", atelier: "Skin", image: "/images/service-skin.jpg" },
  { id: "makeup", title: "North-light desk", atelier: "Makeup", image: "/images/service-makeup.jpg" },
  { id: "brows", title: "The frame", atelier: "Brow", image: "/images/service-brows.jpg" },
  { id: "amara", title: "Skin director", atelier: "Artisans", image: "/images/team-amara.jpg" },
];

export const testimonials = [
  {
    quote:
      "They cut as if the hair had a plan of its own. I left looking like myself, only more decided.",
    name: "Clara V.",
    house: "Paris",
    service: "Cut & Form",
  },
  {
    quote:
      "The facial did not announce itself. Two days later people asked if I had slept, which is the only compliment I want.",
    name: "Hana S.",
    house: "Tokyo",
    service: "Skin Rituals",
  },
  {
    quote:
      "Bridal morning without theatre. On time, quiet room, makeup that held through dancing and a humid garden.",
    name: "Elena M.",
    house: "London",
    service: "Bridal Maison",
  },
  {
    quote:
      "Colour that looks like I grew it. No stripes, no apology. They mixed three bowls and that was the whole conversation.",
    name: "Priya K.",
    house: "New York",
    service: "Colour Atelier",
  },
];

export const faqs = [
  {
    q: "Do I need a consultation first?",
    a: "For colour, bridal, and any corrective work, yes — we book a short consult into the appointment. Cuts, nails, brows, and facials can be booked directly.",
  },
  {
    q: "How do I book across houses?",
    a: "Choose a house, a service, and a time. Your details stay on this device. The house desk confirms by email within a day. Walk-ins are held for nails and brows only.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Twenty-four hours for most services, seventy-two for bridal. Late changes release the chair so another guest can take it.",
  },
  {
    q: "Are the houses appointment-only?",
    a: "Yes, with a small waiting list for nails and brows after 16:00. We keep the floor quiet on purpose.",
  },
  {
    q: "Do you take children?",
    a: "We see guests sixteen and over, and younger guests only for a simple cut with a parent present.",
  },
];

export const navLinks = [
  { href: "/services", label: "Atelier" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/atelier", label: "Artisans" },
  { href: "/houses", label: "Houses" },
  { href: "/book", label: "Book" },
];

export const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export function serviceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function artisanBySlug(slug: string) {
  return artisans.find((a) => a.slug === slug);
}

export function houseBySlug(slug: string) {
  return houses.find((h) => h.slug === slug);
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDuration(min: number, max: number) {
  if (min === max) return `${min} min`;
  return `${min}–${max} min`;
}
