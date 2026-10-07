/**
 * Centralised configuration for the rule-based salon assistant.
 * Everything the bot can say or link to is derived from this file and
 * `@/lib/salon-data`, so the same engine can be reused for another business.
 *
 * NO LLM / API / backend is involved anywhere in the chatbot.
 */
import {
  artisans,
  faqs as siteFaqs,
  houses,
  HOUSE_FOUNDING,
  HOUSE_NAME,
  HOUSE_TAGLINE,
  services,
} from "@/lib/salon-data";

/* ------------------------------------------------------------------ */
/* Business                                                            */
/* ------------------------------------------------------------------ */

/**
 * WhatsApp number in international format, digits only (no "+").
 * ⚠️  Defaults to the London house line from salon-data. Replace with the
 * studio's real WhatsApp Business number — it is used in ONE place only.
 */
export const WHATSAPP_NUMBER = "442074991400";

export const business = {
  name: HOUSE_NAME,
  assistantName: `${HOUSE_NAME} Beauty Assistant`,
  tagline: HOUSE_TAGLINE,
  founded: HOUSE_FOUNDING,
  whatsapp: WHATSAPP_NUMBER,
  email: houses[0]?.email ?? "",
  instagramUrl: "",
} as const;

export type HouseInfo = {
  slug: string;
  city: string;
  neighbourhood: string;
  address: string;
  hours: string;
  phone: string;
  email: string;
  mapsUrl: string;
  telHref: string;
};

/** Optional hand-picked Google Maps links per house slug. */
const mapsOverrides: Record<string, string> = {};

export const chatHouses: HouseInfo[] = houses.map((h) => ({
  ...h,
  mapsUrl:
    mapsOverrides[h.slug] ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${HOUSE_NAME} ${h.address} ${h.city}`,
    )}`,
  telHref: `tel:${h.phone.replace(/[^+\d]/g, "")}`,
}));

/* ------------------------------------------------------------------ */
/* Services & categories                                               */
/* ------------------------------------------------------------------ */

export type CategoryId = "makeup" | "bridal" | "hair" | "skin" | "nails";

export const categories: {
  id: CategoryId;
  label: string;
  emoji: string;
  intro: string;
  serviceSlugs: string[];
}[] = [
  {
    id: "makeup",
    label: "Makeup",
    emoji: "💄",
    intro: "What kind of makeup are you looking for?",
    serviceSlugs: ["makeup", "brows"],
  },
  {
    id: "bridal",
    label: "Bridal",
    emoji: "👰",
    intro: "Congratulations! 👰 What are you looking for?",
    serviceSlugs: ["bridal"],
  },
  {
    id: "hair",
    label: "Hair",
    emoji: "💇",
    intro: "Happy to help with hair. Which of these fits best?",
    serviceSlugs: ["cut", "colour"],
  },
  {
    id: "skin",
    label: "Skin & Facial",
    emoji: "✨",
    intro: "Skin and body, one ritual at a time. Pick a direction:",
    serviceSlugs: ["skin", "body"],
  },
  {
    id: "nails",
    label: "Nails",
    emoji: "💅",
    intro: "Nails are our quickest ritual. Here's the service:",
    serviceSlugs: ["nails"],
  },
];

/** Makeup occasions (decision rules) → which service answers each. */
export const makeupOccasions = [
  { id: "bridal", label: "Bridal", service: "bridal" },
  { id: "party", label: "Party", service: "makeup" },
  { id: "engagement", label: "Engagement / Reception", service: "makeup" },
  { id: "photoshoot", label: "Photoshoot", service: "makeup" },
] as const;

/** Bridal flow buttons — only services that exist in salon-data. */
export const bridalOptions = [
  { label: "Bridal Maison", service: "bridal" },
  { label: "Makeup only", service: "makeup" },
  { label: "Skin before the day", service: "skin" },
  { label: "Hair only", service: "cut" },
] as const;

/** "Not sure" recommendation tree. */
export const occasionTree = [
  { id: "wedding", label: "Wedding", emoji: "💍" },
  { id: "party", label: "Party", emoji: "🥂" },
  { id: "festival", label: "Festival", emoji: "🎉" },
  { id: "selfcare", label: "Regular self-care", emoji: "🌿" },
  { id: "photoshoot", label: "Photoshoot", emoji: "📸" },
] as const;

export const occasionRecommendations: Record<
  string,
  { text: string; services: string[] }
> = {
  bride: {
    text: "Wonderful! For the bride, this is the one to look at:",
    services: ["bridal", "skin"],
  },
  guest: {
    text: "For wedding guests, these pair well:",
    services: ["makeup", "cut"],
  },
  party: { text: "For a party, I'd look at:", services: ["makeup", "cut", "nails"] },
  festival: {
    text: "For a festive look, these are popular starting points:",
    services: ["makeup", "nails", "cut"],
  },
  selfcare: {
    text: "For regular self-care, try one of these:",
    services: ["skin", "body", "nails"],
  },
  photoshoot: {
    text: "For the camera, these work together:",
    services: ["makeup", "brows", "cut"],
  },
};

/* ------------------------------------------------------------------ */
/* Intent keywords                                                     */
/* ------------------------------------------------------------------ */

export type IntentId =
  | "GREETING"
  | "SERVICES"
  | "BRIDAL"
  | "MAKEUP"
  | "HAIR"
  | "SKIN"
  | "FACIAL"
  | "NAILS"
  | "BROWS"
  | "BODY"
  | "PRICING"
  | "LOCATION"
  | "HOURS"
  | "CONTACT"
  | "WHATSAPP"
  | "BOOKING"
  | "CONSULTATION"
  | "GALLERY"
  | "ABOUT"
  | "NOTSURE"
  | "THANKS"
  | "GOODBYE";

const cityWords = chatHouses.flatMap((h) => [h.city, h.neighbourhood]);

export const intentKeywords: Record<IntentId, string[]> = {
  GREETING: ["hi", "hello", "hey", "hiya", "greetings", "good morning", "good afternoon", "good evening", "namaste"],
  SERVICES: ["services", "service", "treatments", "menu", "catalogue", "what do you offer", "what do you do", "what you offer", "offer"],
  BRIDAL: ["bridal", "bride", "brides", "wedding", "weddings", "marriage", "married", "getting married", "big day"],
  MAKEUP: ["makeup", "make up", "mua", "cosmetics", "glam", "party look"],
  HAIR: ["hair", "hairstyle", "hairstyles", "hairdo", "hairdresser", "stylist", "styling"],
  SKIN: ["skin", "skincare", "skin care", "complexion", "glow"],
  FACIAL: ["facial", "facials", "peel", "cleanup", "clean up", "hydrafacial"],
  NAILS: ["nails", "nail", "manicure", "pedicure", "mani", "pedi", "nail art", "nail polish"],
  BROWS: ["brow", "brows", "eyebrow", "eyebrows", "lash", "lashes", "tint", "lash lift", "threading"],
  BODY: ["body", "spa", "massage", "relax", "relaxation", "body spa", "body ritual"],
  PRICING: ["price", "prices", "pricing", "cost", "costs", "how much", "rate", "rates", "charges", "charge", "fee", "fees", "budget", "quote", "tariff", "starting from", "expensive", "cheap", "afford"],
  LOCATION: ["where", "address", "location", "located", "directions", "how to reach", "map", "maps", "find you", "nearby", "near me", "branch", "branches", "houses", ...cityWords],
  HOURS: ["open", "opening", "timing", "timings", "hours", "closing", "closed", "working hours", "when are you", "what time", "today", "weekend"],
  CONTACT: ["contact", "phone", "number", "call", "email", "mail", "reach you", "get in touch", "talk to someone", "speak to", "human"],
  WHATSAPP: ["whatsapp", "whats app", "wa", "chat on"],
  BOOKING: ["book", "booking", "reserve", "reservation", "enquire", "enquiry", "inquire", "inquiry", "an appointment", "make appointment", "schedule", "slot"],
  CONSULTATION: ["consultation", "consult", "trial", "bridal trial", "advice from"],
  GALLERY: ["gallery", "lookbook", "photos", "photo", "pictures", "portfolio", "images", "previous work", "your work", "before and after"],
  ABOUT: ["about", "who are you", "tell me about", "story", "founded", "history", "team", "artisan", "artisans", "directors", "about us"],
  NOTSURE: ["not sure", "unsure", "dont know", "do not know", "recommend", "suggest", "suggestion", "help me choose", "what should i", "which service", "confused", "no idea", "advice"],
  THANKS: ["thanks", "thank", "thankyou", "thank you", "cheers", "appreciate"],
  GOODBYE: ["bye", "goodbye", "see you", "good night", "talk later", "cya"],
};

/** Higher = handled first when several intents fire. */
export const intentPriority: Record<IntentId, number> = {
  BOOKING: 100,
  CONSULTATION: 90,
  WHATSAPP: 85,
  PRICING: 80,
  BRIDAL: 70,
  MAKEUP: 68,
  FACIAL: 67,
  SKIN: 66,
  NAILS: 65,
  BROWS: 64,
  BODY: 63,
  HAIR: 60,
  HOURS: 55,
  LOCATION: 54,
  CONTACT: 53,
  GALLERY: 45,
  ABOUT: 44,
  SERVICES: 43,
  NOTSURE: 40,
  GREETING: 20,
  THANKS: 10,
  GOODBYE: 10,
};

/** Specificity: breaks score ties (bridal > makeup, facial > skin …). */
export const intentSpecificity: Partial<Record<IntentId, number>> = {
  BRIDAL: 3,
  FACIAL: 3,
  BROWS: 3,
  NAILS: 3,
  MAKEUP: 2,
  SKIN: 2,
  BODY: 2,
  HAIR: 1,
};

/** Sub-service keywords that point at a single service. */
export const serviceKeywords: Record<string, string[]> = {
  cut: ["haircut", "haircuts", "cut", "cuts", "trim", "trims", "blow dry", "blowdry", "blowout"],
  colour: ["colour", "color", "coloring", "colouring", "balayage", "highlights", "dye", "gloss", "hair colour", "hair color"],
};

/** Topic intents → services they resolve to. */
export const intentServices: Partial<Record<IntentId, string[]>> = {
  BRIDAL: ["bridal"],
  MAKEUP: ["makeup"],
  SKIN: ["skin"],
  FACIAL: ["skin"],
  NAILS: ["nails"],
  BROWS: ["brows"],
  BODY: ["body"],
};

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */

export type FaqItem = { q: string; a: string; keywords: string[] };

const faqKeywords: string[][] = [
  ["consultation first", "need a consultation", "do i need a consult", "consult first"],
  ["across houses", "cross houses", "how do i book", "which house"],
  ["cancellation", "cancel", "cancelling", "refund", "reschedule", "late change"],
  ["appointment only", "appointment required", "need an appointment", "walk in", "walk ins", "walkin", "waiting list"],
  ["children", "child", "kids", "kid", "age limit", "under 16", "minor"],
];

export const faqs: FaqItem[] = [
  ...siteFaqs.map((f, i) => ({ ...f, keywords: faqKeywords[i] ?? [] })),
  {
    q: "Do you offer home or hotel service?",
    a: "Bridal Maison travels to the house or hotel, or works from the atelier. For any other service, please ask the house desk.",
    keywords: ["home service", "hotel service", "come to me", "come to my house", "travel to me", "mobile service", "on location", "at home"],
  },
];

/* ------------------------------------------------------------------ */
/* Copy (every sentence the bot speaks comes from here)                */
/* ------------------------------------------------------------------ */

export const copy = {
  greeting: `Hi 👋 Welcome to ${HOUSE_NAME}. What can I help you with?`,
  nudge: "Need help choosing a service?",
  statusLine: "Usually replies instantly",
  inputPlaceholder: "Type your question…",
  unknown: "I'm happy to help! Please choose one of these options, or type your question in a different way:",
  thanks: "You're very welcome! Anything else I can help with?",
  goodbye: "Thank you for stopping by. Whenever you're ready, I'm here. 🤍",
  noPrice:
    "Pricing depends on the selected service and requirements. I can connect you with the studio on WhatsApp for an exact quote.",
  pricingIntro: "Here is where each service starts. The final price is confirmed after a short reading:",
  availabilityNote:
    "I can't see live availability, so the house desk confirms every enquiry.",
  bookStart: "I can help you start an enquiry. Which service are you interested in?",
  bookDate: "Do you have a preferred date? Type one (for example “15 October”) or pick an option.",
  bookTime: "And a preferred time of day?",
  bookHouse: "Which house would you prefer?",
  bookName: "Optional: what name should the desk use? You can skip this.",
  bookDone: "Your enquiry is ready. Send it on WhatsApp, or reserve in the booking form.",
  consultNote:
    "For colour, bridal and any corrective work, we book a short consultation into the appointment.",
  notSureStart: "No problem! What are you preparing for?",
  notSureBride: "Are you the bride?",
  notSureOther: "Tell me what the occasion is and I'll show you suitable options.",
  makeupNotSure: "No problem! Tell me what the occasion is and I'll show you suitable options.",
  galleryText: "Here's the lookbook, a few frames from the floor. Opening it now.",
  aboutText: `${HOUSE_NAME} is a house of hair, skin and quiet ritual, founded in ${HOUSE_FOUNDING}, with ${houses.length} houses (${houses
    .map((h) => h.city)
    .join(", ")}) and directors such as ${artisans
    .slice(0, 2)
    .map((a) => a.name)
    .join(" and ")}.`,
  servicesIntro: "We work across eight ateliers. Pick an area, or tell me what you need:",
  directionsPick: "Which house? Tap a city for directions.",
  callPick: "Which house would you like to call?",
  houseNote: "Houses are appointment-only, so booking ahead is best.",
} as const;

export const welcomeQuickReplies = [
  { id: "cat:makeup", label: "💄 Makeup" },
  { id: "cat:bridal", label: "👰 Bridal" },
  { id: "cat:hair", label: "💇 Hair" },
  { id: "cat:skin", label: "✨ Skin & Facial" },
  { id: "cat:nails", label: "💅 Nails" },
  { id: "price", label: "💰 Pricing" },
  { id: "loc", label: "📍 Location" },
  { id: "book", label: "📅 Enquiry" },
] as const;

export const unknownQuickReplies = [
  { id: "services", label: "✨ Services" },
  { id: "cat:bridal", label: "👰 Bridal" },
  { id: "price", label: "💰 Pricing" },
  { id: "loc", label: "📍 Location" },
  { id: "wa", label: "💬 WhatsApp" },
] as const;

export { services };
