import type { QuickReply } from "@/lib/chatbot/responseEngine";
import { cn } from "@/lib/utils";
import { ServiceRecommendation } from "@/components/chat/ServiceRecommendation";

export type ChatMsg = {
  id: string;
  role: "bot" | "user";
  text: string;
  services?: string[];
  quick?: QuickReply[];
  /** contains personal input – never written to localStorage */
  sensitive?: boolean;
};

export function ChatMessage({
  msg,
  onView,
  onEnquire,
}: {
  msg: ChatMsg;
  onView: (slug: string) => void;
  onEnquire: (slug: string) => void;
}) {
  const isBot = msg.role === "bot";
  return (
    <div
      data-bot-msg={isBot ? "" : undefined}
      className={cn(
        "flex animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none",
        isBot ? "justify-start" : "justify-end",
      )}
    >
      <div className={cn("flex max-w-[88%] flex-col gap-2", isBot ? "items-start" : "items-end")}>
        <p
          className={cn(
            "whitespace-pre-line break-words rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed",
            isBot
              ? "rounded-bl-md bg-raised text-ink shadow-[var(--shadow-border)]"
              : "rounded-br-md bg-ink text-paper",
          )}
        >
          <span className="sr-only">{isBot ? "Assistant: " : "You: "}</span>
          {msg.text}
        </p>
        {isBot && msg.services?.length ? (
          <div className="grid w-[min(100%,19rem)] gap-2">
            {msg.services.map((slug) => (
              <ServiceRecommendation key={slug} slug={slug} onView={onView} onEnquire={onEnquire} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
