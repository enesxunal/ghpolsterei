type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
  tone?: "default" | "on-navy";
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className = "",
  id,
  tone = "default",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const onNavy = tone === "on-navy";

  return (
    <div className={`max-w-2xl ${alignClass} ${className}`}>
      <p
        className={`text-[0.75rem] font-medium uppercase tracking-[0.18em] sm:text-[0.8125rem] ${
          onNavy ? "text-gold" : "text-gold-dark"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`mt-3 font-serif text-[1.85rem] font-semibold leading-[1.12] sm:text-4xl lg:text-[2.65rem] xl:text-[3.1rem] ${
          onNavy ? "text-ivory" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            onNavy ? "text-ivory/80" : "text-muted"
          }`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
