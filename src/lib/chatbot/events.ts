/** Local-only event tracking + a tiny bus so other components can talk to the chatbot. */

export type ChatEventName =
  | "chat_opened"
  | "service_selected"
  | "pricing_requested"
  | "whatsapp_clicked"
  | "directions_clicked"
  | "booking_started"
  | "phone_clicked"
  | "hotspot_selected";

export type ChatEvent = { name: ChatEventName; at: number; payload?: Record<string, unknown> };

const log: ChatEvent[] = [];

/**
 * Records an event in memory and dispatches `aurelia:chat-event` on window.
 * Nothing leaves the browser — connect a listener to your analytics later.
 */
export function trackChatEvent(name: ChatEventName, payload?: Record<string, unknown>) {
  const event: ChatEvent = { name, at: Date.now(), payload };
  log.push(event);
  if (log.length > 200) log.shift();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("aurelia:chat-event", { detail: event }));
  }
}

export function getChatEvents(): readonly ChatEvent[] {
  return log;
}

export const CHAT_COMMAND_EVENT = "aurelia:chat-command";

/** Ask the chatbot to open (optionally running a quick-reply action id such as "svc:bridal"). */
export function openChat(actionId?: string, label?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CHAT_COMMAND_EVENT, { detail: { actionId, label } }));
}
