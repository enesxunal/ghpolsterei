import Image from "next/image";
import { site } from "@/data/site";

type BrandLogoProps = {
  variant?: "gold" | "white";
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  variant = "gold",
  className = "h-[60px] w-auto lg:h-[80px]",
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src={variant === "gold" ? site.brand.logoColor : site.brand.logoWhite}
      alt={site.name}
      width={780}
      height={566}
      className={`object-contain object-left ${className}`}
      priority={priority}
      sizes="280px"
    />
  );
}
