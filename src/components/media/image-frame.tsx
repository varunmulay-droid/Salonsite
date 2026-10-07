import { cn } from "@/lib/utils";

function ImageFrame({
  src,
  alt,
  className,
  imgClassName,
  kenburns = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  kenburns?: boolean;
}) {
  return (
    <div className={cn("overflow-hidden bg-sand", className)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover",
          kenburns && "animate-kenburns origin-center",
          imgClassName,
        )}
      />
    </div>
  );
}

export { ImageFrame };
