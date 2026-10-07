import * as React from "react";
import { Send } from "lucide-react";
import { copy } from "@/data/chatbot";

export const ChatInput = React.forwardRef<HTMLInputElement, { onSend: (text: string) => void }>(
  function ChatInput({ onSend }, ref) {
    const [value, setValue] = React.useState("");
    const empty = value.trim().length === 0;
    return (
      <form
        className="flex items-center gap-2 border-t border-border bg-paper px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        onSubmit={(e) => {
          e.preventDefault();
          if (empty) return;
          onSend(value.trim());
          setValue("");
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          Type your question
        </label>
        <input
          id="chat-input"
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={200}
          autoComplete="off"
          enterKeyHint="send"
          placeholder={copy.inputPlaceholder}
          className="h-11 min-w-0 flex-1 rounded-full border border-input bg-raised px-4 text-base text-ink placeholder:text-taupe/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          aria-label="Send message"
          aria-disabled={empty}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-paper transition-[opacity,transform] duration-150 hover:bg-ink/90 active:scale-95 aria-disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          <Send className="size-4" />
        </button>
      </form>
    );
  },
);
