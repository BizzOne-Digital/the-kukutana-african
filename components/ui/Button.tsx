import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "outline";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold text-text-dark hover:bg-gold-light shadow-[0_8px_30px_rgba(201,162,74,0.25)]",
  secondary:
    "bg-transparent border border-gold-light/70 text-cream hover:bg-gold-light/10",
  outline:
    "bg-transparent border border-cream/40 text-cream hover:border-gold hover:text-gold",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide uppercase transition-all duration-300 rounded-sm";

interface LinkButtonProps {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function LinkButton({ href, variant = "primary", className, children }: LinkButtonProps) {
  return (
    <Link href={href} className={clsx(baseClasses, variantClasses[variant], className)}>
      {children}
    </Link>
  );
}

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export default function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], "disabled:opacity-50 disabled:cursor-not-allowed", className)}
      {...props}
    >
      {children}
    </button>
  );
}
