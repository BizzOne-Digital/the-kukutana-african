import clsx from "clsx";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={clsx(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p
          className={clsx(
            "mb-4 text-xs sm:text-sm tracking-[0.3em] uppercase font-medium",
            dark ? "text-gold-light" : "text-gold"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={clsx(
          "font-serif-heading font-medium leading-[1.1] text-balance",
          "text-[clamp(2rem,4vw,3.5rem)]",
          dark ? "text-ivory" : "text-text-dark"
        )}
      >
        {title}
      </h2>
      <div
        className={clsx(
          "mt-6 h-px w-20 bg-gold",
          align === "center" && "mx-auto"
        )}
      />
    </div>
  );
}
