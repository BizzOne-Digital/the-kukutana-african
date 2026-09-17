import Image from "next/image";

interface LogoProps {
  logoUrl?: string;
  variant?: "header" | "footer" | "compact";
}

export default function Logo({ variant = "header" }: LogoProps) {
  const size = variant === "compact" ? 40 : 52;

  return (
    <Image
      src="/logo.png"
      alt="Kukutana African American History & Culture Museum"
      width={size * 4}
      height={size}
      className="object-contain w-auto"
      style={{ height: size }}
      priority
    />
  );
}
