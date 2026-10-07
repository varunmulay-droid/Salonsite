import {
  chatHouses,
  faqs,
  intentKeywords,
  intentPriority,
  intentServices,
  intentSpecificity,
  serviceKeywords,
  type FaqItem,
  type IntentId,
} from "@/data/chatbot";
import { services } from "@/lib/salon-data";

export type IntentMatch = {
  id: IntentId;
  /** number of distinct keywords hit */
  hits: number;
  /** hits / total keywords (spec ratio, used as secondary signal) */
  ratio: number;
  /** final ranking score */
  score: number;
};

export type MatchResult = {
  raw: string;
  normalized: string;
  /** intents, best first (priority → score → specificity) */
  intents: IntentMatch[];
  /** services resolved from the text, most specific first */
  services: string[];
  /** house slug if the text names a city / neighbourhood */
  house?: string;
  faq?: { item: FaqItem; score: number };
};

/** lowercase, strip accents + punctuation, collapse whitespace */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function editDistanceAtMostOne(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

function tokenMatches(token: string, word: string): boolean {
  if (token === word) return true;
  if (word.length >= 3 && (token === `${word}s` || token === `${word}es` || word === `${token}s`)) return true;
  if (word.length >= 6 && token.length >= 6 && editDistanceAtMostOne(token, word)) return true;
  return false;
}

/** true when `phrase` (normalised) occurs in the input. */
function phraseHit(normalized: string, tokens: string[], phrase: string): boolean {
  const p = normalize(phrase);
  if (!p) return false;
  if (p.includes(" ")) return ` ${normalized} `.includes(` ${p} `);
  return tokens.some((t) => tokenMatches(t, p));
}

function countHits(normalized: string, tokens: string[], phrases: string[]): number {
  let hits = 0;
  for (const phrase of phrases) if (phraseHit(normalized, tokens, phrase)) hits++;
  return hits;
}

const STOP = new Set([
  "do", "i", "you", "a", "an", "the", "is", "are", "to", "for", "of", "and", "or", "my", "me", "we", "your", "it", "in", "on", "can", "what", "how", "with", "have", "need", "about",
]);

export function matchIntents(raw: string): MatchResult {
  const normalized = normalize(raw);
  const tokens = normalized.split(" ").filter(Boolean);

  const matches: IntentMatch[] = [];
  (Object.keys(intentKeywords) as IntentId[]).forEach((id) => {
    const list = intentKeywords[id];
    const hits = countHits(normalized, tokens, list);
    if (hits > 0) {
      const ratio = hits / list.length;
      const score = hits + ratio + (intentSpecificity[id] ?? 0) * 0.1;
      matches.push({ id, hits, ratio, score });
    }
  });

  // Sub-service keywords (haircut, balayage …) imply HAIR and a concrete service.
  const serviceScores = new Map<string, number>();
  const bump = (slug: string, by: number) => serviceScores.set(slug, (serviceScores.get(slug) ?? 0) + by);

  for (const [slug, words] of Object.entries(serviceKeywords)) {
    const hits = countHits(normalized, tokens, words);
    if (hits > 0) {
      bump(slug, hits + 0.5);
      if (!matches.some((m) => m.id === "HAIR")) {
        matches.push({ id: "HAIR", hits, ratio: 0.1, score: hits + 0.2 });
      }
    }
  }
  for (const m of matches) {
    for (const slug of intentServices[m.id] ?? []) bump(slug, m.hits + (m.id === "BRIDAL" ? 1 : 0));
  }

  const validSlugs = new Set(services.map((s) => s.slug));
  const resolvedServices = [...serviceScores.entries()]
    .filter(([slug]) => validSlugs.has(slug))
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => slug);

  matches.sort(
    (a, b) =>
      intentPriority[b.id] - intentPriority[a.id] ||
      b.score - a.score ||
      (intentSpecificity[b.id] ?? 0) - (intentSpecificity[a.id] ?? 0),
  );

  // House by name
  let house: string | undefined;
  for (const h of chatHouses) {
    const names = [h.city, h.neighbourhood, h.slug.replace("-", " ")];
    if (names.some((n) => phraseHit(normalized, tokens, n))) {
      house = h.slug;
      break;
    }
  }

  // FAQ: keyword phrases first, otherwise content-word overlap with the question
  let faq: MatchResult["faq"];
  const content = tokens.filter((t) => !STOP.has(t) && t.length > 2);
  for (const item of faqs) {
    let score = countHits(normalized, tokens, item.keywords) * 3;
    if (!score && content.length >= 2) {
      const qTokens = normalize(item.q).split(" ");
      const overlap = content.filter((t) => qTokens.some((q) => tokenMatches(t, q))).length;
      if (overlap >= 3) score = overlap;
    }
    if (score > 0 && (!faq || score > faq.score)) faq = { item, score };
  }

  return { raw, normalized, intents: matches, services: resolvedServices, house, faq };
}

export function hasIntent(result: MatchResult, id: IntentId) {
  return result.intents.some((i) => i.id === id);
}
