import * as React from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage, type ChatMsg } from "@/components/chat/ChatMessage";
import { QuickReplies } from "@/components/chat/QuickReplies";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import type { ChatState, QuickReply } from "@/lib/chatbot/responseEngine";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function ChatWindow({
  messages,
  typing,
  chatState,
  onSend,
  onChoose,
  onView,
  onEnquire,
  onClear,
  onClose,
}: {
  messages: ChatMsg[];
  typing: boolean;
  chatState: ChatState;
  onSend: (text: string) => void;
  onChoose: (reply: QuickReply) => void;
  onView: (slug: string) => void;
  onEnquire: (slug: string) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const logRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const titleId = React.useId();

  // Focus the input when the panel opens.
  React.useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60);
    return () => window.clearTimeout(t);
  }, []);

  // Keep the panel above the on-screen keyboard (mobile) and lock page scroll behind it.
  React.useEffect(() => {
    const el = rootRef.current;
    const vv = window.visualViewport;
    const mobile = window.matchMedia("(max-width: 639px)");
    if (!el) return;
    const sync = () => {
      if (!vv || !mobile.matches) {
        el.style.removeProperty("--vv-top");
        el.style.removeProperty("--vv-h");
        return;
      }
      el.style.setProperty("--vv-top", `${vv.offsetTop + 8}px`);
      el.style.setProperty("--vv-h", `${vv.height - 8}px`);
    };
    sync();
    vv?.addEventListener("resize", sync);
    vv?.addEventListener("scroll", sync);
    mobile.addEventListener("change", sync);
    const html = document.documentElement;
    const prev = html.style.overflow;
    if (mobile.matches) html.style.overflow = "hidden";
    return () => {
      vv?.removeEventListener("resize", sync);
      vv?.removeEventListener("scroll", sync);
      mobile.removeEventListener("change", sync);
      html.style.overflow = prev;
    };
  }, []);

  // Auto-scroll: long answers start at their top, short ones stick to the bottom.
  React.useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = reduce ? "auto" : "smooth";
    const bots = log.querySelectorAll<HTMLElement>("[data-bot-msg]");
    const last = bots[bots.length - 1];
    if (!typing && last && last.offsetHeight > log.clientHeight * 0.7) {
      log.scrollTo({ top: last.offsetTop - 12, behavior });
    } else {
      log.scrollTo({ top: log.scrollHeight, behavior });
    }
  }, [messages, typing]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const nodes = rootRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!nodes || nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const lastBotIndex = messages.reduce((acc, m, i) => (m.role === "bot" ? i : acc), -1);
  const lastQuick = !typing && lastBotIndex === messages.length - 1 ? messages[lastBotIndex]?.quick : undefined;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      onKeyDown={onKeyDown}
      className="fixed inset-x-0 bottom-0 z-[70] flex animate-in fade-in slide-in-from-bottom-6 flex-col overflow-hidden border border-border bg-paper text-ink shadow-[0_30px_80px_-24px_rgba(26,22,18,0.5)] duration-300 max-sm:top-[var(--vv-top,0.5rem)] max-sm:h-[var(--vv-h,calc(100dvh-0.5rem))] max-sm:rounded-t-2xl sm:inset-x-auto sm:right-6 sm:bottom-24 sm:h-[min(640px,calc(100dvh-8rem))] sm:w-[400px] sm:rounded-2xl motion-reduce:animate-none"
    >
      <ChatHeader titleId={titleId} onClear={onClear} onClose={onClose} />
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="flex-1 space-y-3 overflow-y-auto overscroll-contain scroll-smooth bg-[radial-gradient(120%_60%_at_50%_0%,color-mix(in_oklab,var(--color-bronze)_14%,transparent),transparent)] px-4 py-4"
      >
        {messages.map((m) => (
          <ChatMessage key={m.id} msg={m} onView={onView} onEnquire={onEnquire} />
        ))}
        {typing ? <TypingIndicator /> : null}
        {lastQuick ? <QuickReplies replies={lastQuick} state={chatState} onChoose={onChoose} /> : null}
      </div>
      <ChatInput ref={inputRef} onSend={onSend} />
    </div>
  );
}
