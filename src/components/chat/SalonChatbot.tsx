import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { ChatMsg } from "@/components/chat/ChatMessage";
import {
  initialState,
  respondToAction,
  respondToText,
  welcomeReply,
  type BotReply,
  type ChatState,
  type Effect,
  type QuickReply,
} from "@/lib/chatbot/responseEngine";
import { CHAT_COMMAND_EVENT, trackChatEvent } from "@/lib/chatbot/events";
import { useSalon } from "@/lib/booking-store";

const STORAGE_KEY = "aurelia-chat-v1";
const NUDGE_KEY = "aurelia-chat-nudge";
const MAX_SAVED = 40;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

type Saved = { at: number; messages: ChatMsg[]; state: ChatState };

const uid = () => Math.random().toString(36).slice(2, 10);
const isMobile = () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;
const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function botMsg(reply: BotReply): ChatMsg {
  return { id: uid(), role: "bot", text: reply.text, services: reply.services, quick: reply.quick };
}

function load(): Saved | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Saved;
    if (!Array.isArray(saved.messages) || saved.messages.length === 0) return null;
    if (Date.now() - saved.at > MAX_AGE_MS) return null;
    return saved;
  } catch {
    return null;
  }
}

function persist(messages: ChatMsg[], state: ChatState) {
  try {
    // Personal input (a typed name) is masked, and the name is never stored in state.
    const safeMessages = messages.slice(-MAX_SAVED).map((m) => (m.sensitive ? { ...m, text: "•••" } : m));
    const { customerName: _omit, ...safeState } = state;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now(), messages: safeMessages, state: safeState } satisfies Saved));
  } catch {
    /* storage unavailable – the chat still works in memory */
  }
}

export function SalonChatbot() {
  const navigate = useNavigate();
  const overlayOpen = useSalon((s) => s.bookingOpen || s.navOpen || s.look !== null);

  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMsg[]>([]);
  const [chatState, setChatState] = React.useState<ChatState>(initialState);
  const [typing, setTyping] = React.useState(false);
  const [unread, setUnread] = React.useState(true);
  const [nudge, setNudge] = React.useState(false);

  const stateRef = React.useRef<ChatState>(initialState);
  const pending = React.useRef<{ timer: number; commit: () => void } | null>(null);
  const launcherRef = React.useRef<HTMLButtonElement>(null);
  const openedOnce = React.useRef(false);

  /* ---------- boot ---------- */
  React.useEffect(() => {
    const saved = load();
    if (saved) {
      setMessages(saved.messages);
      stateRef.current = saved.state;
      setChatState(saved.state);
      setUnread(false);
    } else {
      setMessages([botMsg(welcomeReply())]);
    }
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && messages.length) persist(messages, chatState);
  }, [mounted, messages, chatState]);

  /* ---------- first-visit nudge (shown once, remembered) ---------- */
  React.useEffect(() => {
    if (!mounted) return;
    let seen = false;
    try {
      seen = window.localStorage.getItem(NUDGE_KEY) === "1";
    } catch {
      seen = true;
    }
    if (seen) return;
    const show = window.setTimeout(() => {
      setNudge(true);
      try {
        window.localStorage.setItem(NUDGE_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 7000);
    const hide = window.setTimeout(() => setNudge(false), 7000 + 14000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [mounted]);

  /* ---------- helpers ---------- */
  const applyPatch = React.useCallback((patch?: Partial<ChatState>) => {
    if (!patch) return;
    stateRef.current = { ...stateRef.current, ...patch };
    setChatState(stateRef.current);
  }, []);

  const flush = React.useCallback(() => {
    if (pending.current) {
      window.clearTimeout(pending.current.timer);
      pending.current.commit();
      pending.current = null;
    }
  }, []);

  const closeChat = React.useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) window.setTimeout(() => launcherRef.current?.focus({ preventScroll: true }), 0);
  }, []);

  const runEffect = React.useCallback(
    (effect: Effect) => {
      const leave = () => {
        if (isMobile()) setOpen(false);
      };
      switch (effect.type) {
        case "navigate":
          void navigate({ to: effect.to });
          leave();
          break;
        case "service":
          void navigate({ to: "/services/$slug", params: { slug: effect.slug } });
          leave();
          break;
        case "scroll": {
          if (window.location.pathname === "/") {
            document.getElementById(effect.hash)?.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
          } else {
            void navigate({ to: "/", hash: effect.hash });
          }
          leave();
          break;
        }
        case "booking":
          useSalon.getState().openBooking(effect.service);
          setOpen(false);
          break;
      }
    },
    [navigate],
  );

  const deliver = React.useCallback(
    (reply: BotReply) => {
      flush();
      setTyping(true);
      const delay = prefersReduced() ? 120 : Math.min(700, 300 + reply.text.length * 2);
      const commit = () => {
        setTyping(false);
        setMessages((m) => [...m, botMsg(reply)]);
      };
      pending.current = {
        commit,
        timer: window.setTimeout(() => {
          pending.current = null;
          commit();
        }, delay),
      };
    },
    [flush],
  );

  const respond = React.useCallback(
    (userText: string, reply: BotReply) => {
      flush();
      setMessages((m) => [...m, { id: uid(), role: "user", text: userText, sensitive: reply.sensitiveUserInput }]);
      applyPatch(reply.patch);
      reply.track?.forEach((t) => trackChatEvent(t.name, t.payload));
      reply.effects?.forEach(runEffect);
      deliver(reply);
    },
    [applyPatch, deliver, flush, runEffect],
  );

  const sendText = React.useCallback(
    (text: string) => respond(text, respondToText(text, stateRef.current)),
    [respond],
  );

  const runAction = React.useCallback(
    (id: string, label: string) => respond(label, respondToAction(id, stateRef.current)),
    [respond],
  );

  const onChoose = React.useCallback((qr: QuickReply) => runAction(qr.id, qr.label), [runAction]);
  const onView = React.useCallback((slug: string) => runAction(`view:${slug}`, "View details"), [runAction]);
  const onEnquire = React.useCallback((slug: string) => runAction(`enq:${slug}`, "Enquire"), [runAction]);

  const clear = React.useCallback(() => {
    flush();
    setTyping(false);
    stateRef.current = initialState;
    setChatState(initialState);
    setMessages([botMsg(welcomeReply())]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [flush]);

  const openPanel = React.useCallback(() => {
    setOpen(true);
    setUnread(false);
    setNudge(false);
    if (!openedOnce.current) {
      openedOnce.current = true;
      trackChatEvent("chat_opened");
    }
  }, []);

  /* ---------- other components can open / drive the chat ---------- */
  React.useEffect(() => {
    const onCommand = (e: Event) => {
      const detail = (e as CustomEvent<{ actionId?: string; label?: string }>).detail;
      openPanel();
      if (detail?.actionId) runAction(detail.actionId, detail.label ?? "Tell me more");
    };
    window.addEventListener(CHAT_COMMAND_EVENT, onCommand);
    return () => window.removeEventListener(CHAT_COMMAND_EVENT, onCommand);
  }, [openPanel, runAction]);

  // Step aside when a sheet / lightbox opens.
  React.useEffect(() => {
    if (overlayOpen) setOpen(false);
  }, [overlayOpen]);

  React.useEffect(() => () => flush(), [flush]);

  if (!mounted || overlayOpen) return null;

  return (
    <>
      {open ? (
        <ChatWindow
          messages={messages}
          typing={typing}
          chatState={chatState}
          onSend={sendText}
          onChoose={onChoose}
          onView={onView}
          onEnquire={onEnquire}
          onClear={clear}
          onClose={() => closeChat()}
        />
      ) : null}
      <ChatLauncher
        open={open}
        unread={unread}
        nudge={nudge}
        buttonRef={launcherRef}
        onToggle={() => (open ? closeChat(false) : openPanel())}
        onDismissNudge={() => setNudge(false)}
      />
    </>
  );
}
