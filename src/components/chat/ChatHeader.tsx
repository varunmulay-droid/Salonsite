import { RotateCcw, X } from "lucide-react";
import { business, copy } from "@/data/chatbot";

export function ChatHeader({
  titleId,
  onClear,
  onClose,
}: {
  titleId: string;
  onClear: () => void;
  onClose: () => void;
}) {
  return (
    <header className="flex items-center gap-3 border-b border-border bg-ink px-4 py-3.5 text-paper">
      <span
        aria-hidden
        className="grid size-10 shrink-0 place-items-center rounded-full bg-bronze font-display text-xl leading-none text-ink"
      >
        {business.name.charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <h2 id={titleId} className="font-display text-lg leading-tight tracking-tight sm:text-xl">
          {business.assistantName}
        </h2>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-paper/70">
          <span aria-hidden className="size-1.5 rounded-full bg-bronze" />
          {copy.statusLine}
        </p>
      </div>
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear conversation"
        title="Clear conversation"
        className="grid size-11 place-items-center rounded-full text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze"
      >
        <RotateCcw className="size-4" />
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close chat"
        className="grid size-11 place-items-center rounded-full text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze"
      >
        <X className="size-5" />
      </button>
    </header>
  );
}
