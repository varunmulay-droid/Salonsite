import { resolveQuickHref, type ChatState, type QuickReply } from "@/lib/chatbot/responseEngine";
import { cn } from "@/lib/utils";

const chip =
  "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm leading-tight transition-[background-color,color,transform,box-shadow] duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export function QuickReplies({
  replies,
  state,
  onChoose,
}: {
  replies: QuickReply[];
  state: ChatState;
  onChoose: (reply: QuickReply) => void;
}) {
  if (!replies.length) return null;
  return (
    <ul className="flex flex-wrap gap-2 pt-1" aria-label="Suggested replies">
      {replies.map((reply, i) => {
        const href = resolveQuickHref(reply, state);
        const cls = cn(
          chip,
          "animate-in fade-in slide-in-from-bottom-1 fill-mode-both motion-reduce:animate-none",
          reply.primary
            ? "border-ink bg-ink text-paper hover:bg-ink/90"
            : "border-border bg-raised text-ink hover:bg-sand",
        );
        const style = { animationDelay: `${i * 40}ms` };
        return (
          <li key={reply.id + reply.label}>
            {href ? (
              <a
                href={href}
                className={cls}
                style={style}
                {...(/^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onClick={() => onChoose(reply)}
              >
                {reply.label}
              </a>
            ) : (
              <button type="button" className={cls} style={style} onClick={() => onChoose(reply)}>
                {reply.label}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
