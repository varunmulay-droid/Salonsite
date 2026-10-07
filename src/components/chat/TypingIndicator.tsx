export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2" role="status">
      <span className="sr-only">The assistant is typing</span>
      <div
        aria-hidden
        className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-raised px-4 py-3.5 shadow-[var(--shadow-border)]"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-bounce rounded-full bg-taupe/70 motion-reduce:animate-pulse"
            style={{ animationDelay: `${i * 120}ms`, animationDuration: "900ms" }}
          />
        ))}
      </div>
    </div>
  );
}
