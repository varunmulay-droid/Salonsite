import {
  bridalOptions,
  business,
  categories,
  chatHouses,
  copy,
  makeupOccasions,
  occasionRecommendations,
  occasionTree,
  unknownQuickReplies,
  welcomeQuickReplies,
  type CategoryId,
  type IntentId,
} from "@/data/chatbot";
import { formatDuration, formatPrice, serviceBySlug, services } from "@/lib/salon-data";
import { hasIntent, matchIntents, normalize, type MatchResult } from "@/lib/chatbot/intentMatcher";
import { generateWhatsAppMessage, whatsAppHref, type EnquiryType } from "@/lib/chatbot/whatsapp";
import type { ChatEventName } from "@/lib/chatbot/events";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Step = "service" | "date" | "time" | "house" | "name";

export type ChatState = {
  selectedCategory?: CategoryId;
  selectedService?: string;
  selectedHouse?: string;
  selectedDate?: string;
  selectedTime?: string;
  customerName?: string;
  enquiryType?: EnquiryType;
  occasion?: string;
  step?: Step;
};

export type QuickReply = {
  id: string;
  label: string;
  /** external link (WhatsApp / maps / tel) */
  href?: string;
  primary?: boolean;
};

export type Effect =
  | { type: "navigate"; to: "/lookbook" | "/houses" | "/atelier" | "/services" }
  | { type: "service"; slug: string }
  | { type: "scroll"; hash: string }
  | { type: "booking"; service?: string };

export type BotReply = {
  text: string;
  services?: string[];
  quick: QuickReply[];
  patch?: Partial<ChatState>;
  effects?: Effect[];
  track?: { name: ChatEventName; payload?: Record<string, unknown> }[];
  /** user message contained personal data – do not persist it */
  sensitiveUserInput?: boolean;
};

export const initialState: ChatState = {};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const q = (id: string, label: string, extra?: Partial<QuickReply>): QuickReply => ({ id, label, ...extra });

const categoryQuick = (): QuickReply[] => categories.map((c) => q(`cat:${c.id}`, `${c.emoji} ${c.label}`));

const defaultQuick = (): QuickReply[] => unknownQuickReplies.map((r) => q(r.id, r.label));

function startingLine(slug: string, withDuration = true): string {
  const s = serviceBySlug(slug);
  if (!s) return "";
  if (!s.priceFrom) return `${s.name}: ${copy.noPrice}`;
  const dur = withDuration ? ` · ${formatDuration(s.durationMin, s.durationMax)}` : "";
  return `${s.name} starts from ${formatPrice(s.priceFrom)}${dur}.`;
}

function priceList(slugs: string[]): string {
  return slugs
    .map((slug) => serviceBySlug(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => `• ${s.name}: ${s.priceFrom ? `from ${formatPrice(s.priceFrom)}` : "price on request"}`)
    .join("\n");
}

function houseList(state: ChatState, forceSlug?: string) {
  const slug = forceSlug ?? state.selectedHouse;
  const one = chatHouses.find((h) => h.slug === slug);
  return one ? [one] : chatHouses;
}

function hoursText(state: ChatState, slug?: string): string {
  const list = houseList(state, slug);
  const lines = list.map((h) => `• ${h.city} (${h.neighbourhood}): ${h.hours}`).join("\n");
  return `${list.length === 1 ? "Opening hours" : "Opening hours vary by house"}:\n${lines}\n\n${copy.houseNote}`;
}

function locationText(state: ChatState, slug?: string): string {
  const list = houseList(state, slug);
  const lines = list.map((h) => `• ${h.city}: ${h.address}`).join("\n");
  return `${list.length === 1 ? "Here's the address" : "Here's where to find us"}:\n${lines}`;
}

function contactText(state: ChatState, slug?: string): string {
  const list = houseList(state, slug);
  const lines = list.map((h) => `• ${h.city}: ${h.phone} · ${h.email}`).join("\n");
  return `You can reach a house directly:\n${lines}\n\nOr message us on WhatsApp.`;
}

function enquiryQuick(): QuickReply[] {
  return [
    q("wa", "💬 WhatsApp Enquiry", { primary: true }),
    q("consult", "📅 Consultation"),
    q("price", "💰 Pricing"),
    q("services", "✨ More services"),
  ];
}

/* ------------------------------------------------------------------ */
/* Replies                                                             */
/* ------------------------------------------------------------------ */

export function welcomeReply(): BotReply {
  return { text: copy.greeting, quick: welcomeQuickReplies.map((r) => q(r.id, r.label)) };
}

function unknownReply(): BotReply {
  return { text: copy.unknown, quick: defaultQuick() };
}

function serviceReply(slug: string, state: ChatState): BotReply {
  const s = serviceBySlug(slug);
  if (!s) return unknownReply();
  const isConsult = slug === "bridal" || slug === "colour";
  return {
    text: `${s.name}: ${s.summary}\n${startingLine(slug)}`,
    services: [slug],
    patch: { selectedService: slug, enquiryType: state.enquiryType === "quote" ? "quote" : "booking" },
    quick: [
      q("wa", "💬 WhatsApp Enquiry", { primary: true }),
      isConsult ? q("consult", "📅 Consultation") : q("price", "💰 All prices"),
      q("loc", "📍 Location"),
      q("services", "✨ More services"),
    ],
    track: [{ name: "service_selected", payload: { service: slug } }],
  };
}

function startEnquiry(opts: { service?: string; type: EnquiryType; preface?: string }, state: ChatState): BotReply {
  const reset: Partial<ChatState> = {
    enquiryType: opts.type,
    selectedDate: undefined,
    selectedTime: undefined,
    customerName: undefined,
    occasion: state.occasion,
  };
  const track: BotReply["track"] = [{ name: "booking_started", payload: { service: opts.service, type: opts.type } }];
  const preface = opts.preface ? `${opts.preface}\n\n` : "";

  if (!opts.service) {
    return {
      text: `${preface}${copy.bookStart}`,
      patch: { ...reset, step: "service", selectedService: undefined },
      quick: categoryQuick(),
      track,
    };
  }
  const s = serviceBySlug(opts.service);
  return {
    text: `${preface}Lovely, ${s?.name ?? "great choice"}. ${copy.bookDate}`,
    patch: { ...reset, step: "date", selectedService: opts.service },
    quick: dateQuick(),
    track,
  };
}

const dateQuick = (): QuickReply[] => [
  q("bk:date:This week", "This week"),
  q("bk:date:Next week", "Next week"),
  q("bk:date:Flexible", "Flexible"),
  q("bk:date:", "Skip"),
];

const timeQuick = (): QuickReply[] => [
  q("bk:time:Morning", "🌅 Morning"),
  q("bk:time:Afternoon", "☀️ Afternoon"),
  q("bk:time:Evening", "🌙 Evening"),
  q("bk:time:", "Skip"),
];

const houseQuick = (): QuickReply[] => [
  ...chatHouses.map((h) => q(`bk:house:${h.slug}`, h.city)),
  q("bk:house:any", "Any house"),
];

function afterDate(state: ChatState, date?: string): BotReply {
  return { text: copy.bookTime, patch: { selectedDate: date || undefined, step: "time" }, quick: timeQuick() };
}

function afterTime(time?: string): BotReply {
  return { text: copy.bookHouse, patch: { selectedTime: time || undefined, step: "house" }, quick: houseQuick() };
}

function afterHouse(slug?: string): BotReply {
  return { text: copy.bookName, patch: { selectedHouse: slug, step: "name" }, quick: [q("bk:name:", "Skip")] };
}

function finishEnquiry(state: ChatState, name?: string): BotReply {
  const final: ChatState = { ...state, customerName: name || undefined, step: undefined };
  const preview = generateWhatsAppMessage(final);
  return {
    text: `${copy.bookDone}\n\n“${preview}”\n\n${copy.availabilityNote}`,
    patch: { customerName: name || undefined, step: undefined },
    quick: [
      q("wa:send", "💬 Send Enquiry on WhatsApp", { primary: true }),
      q("bk:reserve", "🗓 Reserve in booking form"),
      q("book", "↺ Start over"),
      q("price", "💰 Pricing"),
    ],
    sensitiveUserInput: Boolean(name),
  };
}

function notSureStart(): BotReply {
  return {
    text: copy.notSureStart,
    quick: [
      ...occasionTree.map((o) => q(`ns:${o.id}`, `${o.emoji} ${o.label}`)),
      q("ns:unsure", "🤷 Not sure"),
    ],
  };
}

function recommendation(key: string, occasion?: string): BotReply {
  const rec = occasionRecommendations[key];
  if (!rec) return unknownReply();
  return {
    text: rec.text,
    services: rec.services,
    patch: { selectedService: rec.services[0], occasion },
    quick: [
      q("wa", "💬 WhatsApp Enquiry", { primary: true }),
      q("consult", "📅 Consultation"),
      q("price", "💰 Pricing"),
    ],
    track: [{ name: "service_selected", payload: { service: rec.services[0], via: "recommendation" } }],
  };
}

/* ------------------------------------------------------------------ */
/* Quick-reply / button actions                                        */
/* ------------------------------------------------------------------ */

export function respondToAction(id: string, state: ChatState): BotReply {
  const [head, ...rest] = id.split(":");
  const arg = rest.join(":");

  switch (head) {
    case "greet":
      return welcomeReply();

    case "services":
      return { text: copy.servicesIntro, quick: categoryQuick() };

    case "cat": {
      const cat = categories.find((c) => c.id === arg);
      if (!cat) return unknownReply();
      const patch = { selectedCategory: cat.id };
      if (cat.id === "nails") return { ...serviceReply("nails", state), patch: { ...patch, selectedService: "nails" } };
      if (cat.id === "makeup") {
        return {
          text: cat.intro,
          patch,
          quick: [...makeupOccasions.map((o) => q(`occ:${o.id}`, o.label)), q("ns:unsure", "Not sure")],
        };
      }
      if (cat.id === "bridal") {
        return {
          text: cat.intro,
          patch,
          quick: [...bridalOptions.map((o) => q(`svc:${o.service}`, o.label)), q("wa", "💬 Talk on WhatsApp", { primary: true })],
        };
      }
      return {
        text: cat.intro,
        patch,
        quick: [
          ...cat.serviceSlugs.map((slug) => q(`svc:${slug}`, serviceBySlug(slug)?.name ?? slug)),
          q("notsure", "🤷 Not sure"),
          q("price", "💰 Pricing"),
        ],
      };
    }

    case "occ": {
      const occ = makeupOccasions.find((o) => o.id === arg);
      if (!occ) return unknownReply();
      const base = serviceReply(occ.service, state);
      const label = occ.label.toLowerCase();
      return {
        ...base,
        text: occ.id === "bridal" ? base.text : `For ${label}, Makeup Studio is the place to start.\n${startingLine("makeup")}`,
        patch: { ...base.patch, occasion: occ.id === "bridal" ? undefined : occ.label },
      };
    }

    case "svc": {
      if (state.step === "service") return startEnquiry({ service: arg, type: state.enquiryType ?? "booking" }, state);
      return serviceReply(arg, state);
    }

    case "view": {
      const s = serviceBySlug(arg);
      if (!s) return unknownReply();
      return {
        text: `Opening ${s.name} for you.`,
        effects: [{ type: "service", slug: arg }],
        quick: [q(`enq:${arg}`, "📅 Enquire"), q("price", "💰 Pricing"), q("services", "✨ More services")],
      };
    }

    case "enq":
      return startEnquiry({ service: arg, type: "booking" }, state);

    case "book":
      return startEnquiry({ type: "booking" }, state);

    case "consult": {
      const type: EnquiryType = "consultation";
      return startEnquiry({ service: state.selectedService, type, preface: copy.consultNote }, state);
    }

    case "price": {
      if (arg) {
        const s = serviceBySlug(arg);
        if (!s) return unknownReply();
        return {
          text: startingLine(arg),
          services: [arg],
          quick: [q("wa:quote", "💬 Get Exact Quote", { primary: true }), q("price", "💰 All prices"), q("book", "📅 Enquiry")],
          track: [{ name: "pricing_requested", payload: { service: arg } }],
        };
      }
      return {
        text: `${copy.pricingIntro}\n${priceList(services.map((s) => s.slug))}`,
        quick: [
          q("cat:bridal", "👰 Bridal"),
          q("cat:hair", "💇 Hair"),
          q("cat:skin", "✨ Skin & Facial"),
          q("wa:quote", "💬 Get Exact Quote", { primary: true }),
        ],
        track: [{ name: "pricing_requested" }],
      };
    }

    case "loc":
      return {
        text: locationText(state),
        quick: [
          q("dir", "📍 Get Directions", { primary: true }),
          q("hours", "🕒 Opening hours"),
          q("wa", "💬 WhatsApp"),
          q("nav:houses", "🏛 Houses page"),
        ],
      };

    case "dir": {
      if (arg) {
        const h = chatHouses.find((x) => x.slug === arg);
        return {
          text: h ? `Opening directions to ${h.city} (${h.neighbourhood}).` : copy.directionsPick,
          patch: { selectedHouse: arg },
          quick: [q("hours", "🕒 Opening hours"), q("book", "📅 Enquiry"), q("wa", "💬 WhatsApp")],
          track: [{ name: "directions_clicked", payload: { house: arg } }],
        };
      }
      return {
        text: copy.directionsPick,
        quick: chatHouses.map((h) => q(`dir:${h.slug}`, `📍 ${h.city}`, { href: h.mapsUrl })),
      };
    }

    case "call": {
      if (arg) {
        const h = chatHouses.find((x) => x.slug === arg);
        return {
          text: h ? `Calling ${h.city}: ${h.phone}.` : copy.callPick,
          quick: [q("wa", "💬 WhatsApp"), q("hours", "🕒 Opening hours"), q("book", "📅 Enquiry")],
          track: [{ name: "phone_clicked", payload: { house: arg } }],
        };
      }
      return {
        text: copy.callPick,
        quick: chatHouses.map((h) => q(`call:${h.slug}`, `📞 ${h.city}`, { href: h.telHref })),
      };
    }

    case "hours":
      return {
        text: hoursText(state),
        quick: [q("loc", "📍 Location"), q("book", "📅 Enquiry"), q("wa", "💬 WhatsApp"), q("services", "✨ Services")],
      };

    case "contact":
      return {
        text: contactText(state),
        quick: [q("wa", "💬 WhatsApp", { primary: true }), q("call", "📞 Call Now"), q("dir", "📍 Directions"), q("book", "📅 Enquiry")],
      };

    case "wa": {
      // "wa", "wa:quote", "wa:send" – the href is resolved from live state at render time.
      return {
        text: arg === "quote" ? "Opening WhatsApp so the studio can give you an exact quote." : "Opening WhatsApp with your details pre-filled.",
        quick: [q("book", "📅 Add date & time"), q("price", "💰 Pricing"), q("loc", "📍 Location")],
        patch: arg === "quote" ? { enquiryType: "quote" } : undefined,
        track: [{ name: "whatsapp_clicked", payload: { kind: arg || "enquiry" } }],
      };
    }

    case "gallery":
      return {
        text: copy.galleryText,
        effects: [{ type: "navigate", to: "/lookbook" }],
        quick: [q("services", "✨ Services"), q("price", "💰 Pricing"), q("book", "📅 Enquiry")],
      };

    case "about":
      return {
        text: copy.aboutText,
        quick: [q("nav:artisans", "👩‍🎨 Meet the artisans"), q("nav:houses", "🏛 Houses"), q("nav:vanity", "🪞 See the vanity"), q("services", "✨ Services")],
      };

    case "nav": {
      if (arg === "houses") return { text: "Opening our houses.", effects: [{ type: "navigate", to: "/houses" }], quick: [q("loc", "📍 Location"), q("hours", "🕒 Hours"), q("book", "📅 Enquiry")] };
      if (arg === "artisans") return { text: "Opening the artisans.", effects: [{ type: "navigate", to: "/atelier" }], quick: [q("services", "✨ Services"), q("book", "📅 Enquiry")] };
      if (arg === "vanity") return { text: "Scrolling to the vanity. Turn it, and tap a glowing point.", effects: [{ type: "scroll", hash: "vanity" }], quick: [q("services", "✨ Services"), q("book", "📅 Enquiry")] };
      return unknownReply();
    }

    case "notsure":
      return notSureStart();

    case "ns": {
      if (arg === "unsure") return { text: copy.notSureOther, quick: categoryQuick() };
      if (arg === "wedding") {
        return { text: copy.notSureBride, quick: [q("ns:bride", "Yes, I'm the bride"), q("ns:guest", "No, a guest")] };
      }
      if (arg === "bride") return recommendation("bride", "Wedding (bride)");
      if (arg === "guest") return recommendation("guest", "Wedding (guest)");
      return recommendation(arg, occasionTree.find((o) => o.id === arg)?.label);
    }

    case "bk": {
      const [kind, ...v] = arg.split(":");
      const value = v.join(":");
      if (kind === "date") return afterDate(state, value);
      if (kind === "time") return afterTime(value);
      if (kind === "house") return afterHouse(value === "any" ? undefined : value);
      if (kind === "name") return finishEnquiry(state, value || undefined);
      if (kind === "reserve") {
        return {
          text: "Opening the booking form for you.",
          effects: [{ type: "booking", service: state.selectedService }],
          quick: [q("wa:send", "💬 Send on WhatsApp instead"), q("services", "✨ Services")],
        };
      }
      return unknownReply();
    }

    default:
      return unknownReply();
  }
}

/** Resolves anchor URLs for quick replies that depend on live state (WhatsApp). */
export function resolveQuickHref(reply: QuickReply, state: ChatState): string | undefined {
  if (reply.href) return reply.href;
  if (reply.id === "wa" || reply.id === "wa:send") return whatsAppHref(state);
  if (reply.id === "wa:quote") return whatsAppHref({ ...state, enquiryType: "quote" });
  return undefined;
}

/* ------------------------------------------------------------------ */
/* Free-text routing                                                   */
/* ------------------------------------------------------------------ */

const SKIP_WORDS = new Set(["skip", "no", "none", "nope", "any", "anytime", "whenever", "not sure", "dont mind"]);
const FLOW_BREAKOUT: IntentId[] = ["PRICING", "LOCATION", "HOURS", "CONTACT", "GOODBYE", "GALLERY", "ABOUT", "SERVICES", "NOTSURE", "THANKS"];
const TOPICS: IntentId[] = ["BRIDAL", "MAKEUP", "HAIR", "SKIN", "FACIAL", "NAILS", "BROWS", "BODY"];
const SOCIAL: IntentId[] = ["GREETING", "THANKS", "GOODBYE"];

function clean(text: string, max = 40) {
  return text.replace(/\s+/g, " ").trim().slice(0, max);
}

function timeLabel(text: string): string | undefined {
  const n = normalize(text);
  if (SKIP_WORDS.has(n)) return undefined;
  if (/\b(morning|am)\b/.test(n)) return "Morning";
  if (/\bafternoon\b/.test(n)) return "Afternoon";
  if (/\b(evening|night)\b/.test(n)) return "Evening";
  return clean(text);
}

function handleStep(m: MatchResult, state: ChatState): BotReply | null {
  const step = state.step;
  if (!step) return null;
  const n = m.normalized;
  const words = n.split(" ").filter(Boolean);
  const skip = SKIP_WORDS.has(n);
  const breakout = m.intents.some((i) => FLOW_BREAKOUT.includes(i.id)) && !skip;

  if (step === "service") {
    if (m.services.length) return startEnquiry({ service: m.services[0], type: state.enquiryType ?? "booking" }, state);
    return null; // fall through to normal routing (category words etc.)
  }
  if (breakout) return null;

  if (step === "date") return afterDate(state, skip ? undefined : clean(m.raw));
  if (step === "time") return afterTime(timeLabel(m.raw));
  if (step === "house") return afterHouse(m.house);
  if (step === "name") {
    if (words.length > 3 || m.intents.length > 0) return null;
    return finishEnquiry(state, skip ? undefined : clean(m.raw, 30));
  }
  return null;
}

export function respondToText(text: string, state: ChatState): BotReply {
  const m = matchIntents(text);
  if (!m.normalized) return unknownReply();

  const stepReply = handleStep(m, state);
  if (stepReply) return { ...stepReply, sensitiveUserInput: state.step === "name" && Boolean(stepReply.sensitiveUserInput) };

  // Stepping out of an unfinished flow: clear the step.
  const base: Partial<ChatState> = state.step ? { step: undefined } : {};
  const withBase = (r: BotReply): BotReply => ({ ...r, patch: { ...base, ...r.patch } });

  const ids = m.intents.map((i) => i.id);
  const has = (id: IntentId) => ids.includes(id);
  const actionIds = ids.filter((i) => !SOCIAL.includes(i));
  const bookingVerb = /\b(book|reserve|enquire|inquire|schedule)\b/.test(m.normalized);

  // 1. FAQ wins for clear question phrasing
  if (m.faq && m.faq.score >= 3 && (!bookingVerb || m.faq.score >= 6)) {
    return withBase({
      text: m.faq.item.a,
      quick: [q("book", "📅 Enquiry"), q("wa", "💬 WhatsApp", { primary: true }), q("services", "✨ Services"), q("loc", "📍 Location")],
    });
  }

  // 2. Social-only messages
  if (actionIds.length === 0) {
    if (has("GOODBYE")) return withBase({ text: copy.goodbye, quick: [q("services", "✨ Services"), q("book", "📅 Enquiry")] });
    if (has("THANKS")) return withBase({ text: copy.thanks, quick: [q("services", "✨ Services"), q("price", "💰 Pricing"), q("book", "📅 Enquiry")] });
    if (has("GREETING")) return withBase(welcomeReply());
    return withBase(unknownReply());
  }

  const primaryService = m.services[0];
  const housePatch: Partial<ChatState> = m.house ? { selectedHouse: m.house } : {};

  // 3. Enquiry flows: BOOKING > CONSULTATION > WHATSAPP
  if (has("BOOKING")) {
    const r = startEnquiry({ service: primaryService, type: "booking" }, { ...state, ...housePatch });
    return { ...r, patch: { ...r.patch, ...housePatch } };
  }
  if (has("CONSULTATION")) {
    const r = startEnquiry({ service: primaryService ?? state.selectedService, type: "consultation", preface: copy.consultNote }, { ...state, ...housePatch });
    return { ...r, patch: { ...r.patch, ...housePatch } };
  }
  if (has("WHATSAPP")) {
    const patch: Partial<ChatState> = { ...housePatch, ...(primaryService ? { selectedService: primaryService } : {}) };
    const svc = primaryService ? serviceBySlug(primaryService)?.name : undefined;
    return withBase({
      text: svc
        ? `Happy to take this to WhatsApp. I've pre-filled an enquiry about ${svc}. ${copy.availabilityNote}`
        : "Happy to take this to WhatsApp. Tap below and I'll open a pre-filled message.",
      patch,
      quick: [q("wa", "💬 Open WhatsApp", { primary: true }), q("book", "📅 Add date & time"), q("price", "💰 Pricing"), q("loc", "📍 Location")],
      track: [{ name: "whatsapp_clicked", payload: { via: "text" } }],
    });
  }

  // 4. Informational answer, composed from every detected intent
  const parts: string[] = [];
  const patch: Partial<ChatState> = { ...housePatch };
  const effects: Effect[] = [];
  const track: NonNullable<BotReply["track"]> = [];
  let cards: string[] = [];
  let quick: QuickReply[] | undefined;

  const hasTopic = ids.some((i) => TOPICS.includes(i));
  const multi = actionIds.filter((i) => !TOPICS.includes(i)).length + (hasTopic ? 1 : 0) > 1;
  const asksPrice = has("PRICING");

  // services / topics / pricing
  if (m.services.length) {
    const list = m.services.slice(0, 3);
    patch.selectedService = list[0];
    patch.enquiryType = "booking";
    cards = list.slice(0, 2);
    track.push({ name: "service_selected", payload: { service: list[0] } });
    if (asksPrice) {
      track.push({ name: "pricing_requested", payload: { service: list[0] } });
      const first = serviceBySlug(list[0]);
      parts.push([`${startingLine(list[0])}${first ? ` ${first.summary}` : ""}`, ...list.slice(1).map((s) => startingLine(s, false))].join("\n"));
    } else {
      const first = serviceBySlug(list[0]);
      parts.push(first ? `${first.name}: ${first.summary}\n${startingLine(list[0])}` : "");
      if (list.length > 1) parts.push(`Related: ${list.slice(1).map((s) => serviceBySlug(s)?.name).filter(Boolean).join(", ")}.`);
    }
  } else if (has("HAIR")) {
    const cat = categories.find((c) => c.id === "hair")!;
    patch.selectedCategory = "hair";
    if (asksPrice) {
      track.push({ name: "pricing_requested", payload: { category: "hair" } });
      parts.push(`Hair services:\n${priceList(cat.serviceSlugs)}`);
    } else {
      parts.push(cat.intro);
    }
    quick = [...cat.serviceSlugs.map((s) => q(`svc:${s}`, serviceBySlug(s)?.name ?? s)), q("notsure", "🤷 Not sure"), q("wa", "💬 WhatsApp")];
  } else if (asksPrice) {
    track.push({ name: "pricing_requested" });
    parts.push(`${copy.pricingIntro}\n${priceList(services.map((s) => s.slug))}`);
    quick = [q("cat:bridal", "👰 Bridal"), q("cat:hair", "💇 Hair"), q("cat:skin", "✨ Skin & Facial"), q("wa:quote", "💬 Get Exact Quote", { primary: true })];
  }

  if (has("HOURS")) parts.push(hoursText(state, m.house));
  if (has("LOCATION")) parts.push(locationText(state, m.house));
  if (has("CONTACT")) parts.push(contactText(state, m.house));
  if (has("GALLERY")) {
    parts.push(copy.galleryText);
    effects.push({ type: "navigate", to: "/lookbook" });
  }
  if (has("ABOUT") && !hasTopic) parts.push(copy.aboutText);
  if (has("SERVICES") && !hasTopic && !m.services.length) parts.push(copy.servicesIntro);

  if (has("NOTSURE") && !hasTopic && parts.length === 0) {
    return withBase(notSureStart());
  }

  if (parts.length === 0) {
    // Only generic words matched (e.g. "offer", "today" alone) – be useful anyway.
    return withBase(has("SERVICES") ? { text: copy.servicesIntro, quick: categoryQuick() } : unknownReply());
  }

  // Closing question + quick replies
  if (!quick) {
    if (m.services.length) {
      const name = serviceBySlug(m.services[0])?.name;
      if (multi && name) parts.push(`Would you like to enquire about ${name}?`);
      quick = enquiryQuick();
    } else if (has("CONTACT")) {
      quick = [q("wa", "💬 WhatsApp", { primary: true }), q("call", "📞 Call Now"), q("dir", "📍 Directions"), q("book", "📅 Enquiry")];
    } else if (has("LOCATION")) {
      quick = [q("dir", "📍 Get Directions", { primary: true }), q("hours", "🕒 Opening hours"), q("wa", "💬 WhatsApp"), q("nav:houses", "🏛 Houses page")];
    } else if (has("HOURS")) {
      quick = [q("loc", "📍 Location"), q("book", "📅 Enquiry"), q("wa", "💬 WhatsApp"), q("services", "✨ Services")];
    } else if (has("SERVICES")) {
      quick = categoryQuick();
    } else {
      quick = [q("services", "✨ Services"), q("price", "💰 Pricing"), q("book", "📅 Enquiry"), q("wa", "💬 WhatsApp")];
    }
  }

  const intro = multi && !has("SERVICES") ? "Absolutely! " : "";
  return withBase({
    text: `${intro}${parts.filter(Boolean).join("\n\n")}`,
    services: cards.length ? cards : undefined,
    patch,
    effects: effects.length ? effects : undefined,
    track: track.length ? track : undefined,
    quick: quick.slice(0, 5),
  });
}

/** Handy for tests / debugging. */
export function debugMatch(text: string) {
  const m = matchIntents(text);
  return { intents: m.intents.map((i) => i.id), services: m.services, faq: m.faq?.item.q, house: m.house, has: (id: IntentId) => hasIntent(m, id) };
}

export { business };
