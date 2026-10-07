import { ChevronDown, MessageCircle, X } from "lucide-react";
import { copy } from "@/data/chatbot";
import { cn } from "@/lib/utils";

export const ChatLauncher = ({
  open,
  unread,
  nudge,
  onToggle,
  onDismissNudge,
  buttonRef,
}: {
  open: boolean;
  unread: boolean;
  nudge: boolean;
  onToggle: () => void;
  onDismissNudge: () => void;
  buttonRef: React.Ref<HTMLButtonElement>;
}) => (
  <div
    className={cn(
      "fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[65] sm:right-6 sm:bottom-6",
      open && "max-sm:hidden",
    )}
  >
    {nudge && !open ? (
      <div className="absolute right-0 bottom-full mb-3 w-max max-w-[15rem] animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
        <div className="relative rounded-2xl rounded-br-md bg-raised py-2.5 pr-10 pl-4 text-sm shadow-[var(--shadow-border-hover)]">
          <button type="button" onClick={onToggle} className="text-left focus-visible:outline-none focus-visible:underline">
            {copy.nudge}
          </button>
          <button
            type="button"
            onClick={onDismissNudge}
            aria-label="Dismiss suggestion"
            className="absolute top-1 right-1 grid size-8 place-items-center rounded-full text-taupe hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    ) : null}
    <button
      ref={buttonRef}
      type="button"
      onClick={onToggle}
      aria-label={open ? "Close chat assistant" : "Open chat assistant"}
      aria-expanded={open}
      aria-haspopup="dialog"
      className="group relative grid size-14 place-items-center rounded-full bg-ink text-paper shadow-[0_10px_30px_-10px_rgba(26,22,18,0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      {unread && !open ? (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-bronze animate-[ping_2.2s_cubic-bezier(0,0,0.2,1)_4] motion-reduce:hidden"
        />
      ) : null}
      {open ? <ChevronDown className="size-6" /> : <MessageCircle className="size-6" />}
      {unread && !open ? (
        <span aria-hidden className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-bronze ring-2 ring-paper" />
      ) : null}
    </button>
  </div>
);
