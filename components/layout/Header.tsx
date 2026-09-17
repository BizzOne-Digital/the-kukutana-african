"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { NAV_LINKS } from "@/lib/constants";
import clsx from "clsx";

interface HeaderProps {
  logoUrl?: string;
}

export default function Header({ logoUrl }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background-dark/90 backdrop-blur-md border-b border-gold/25 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Kukutana home" className="shrink-0">
          <span className="hidden sm:inline-flex">
            <Logo logoUrl={logoUrl} variant="header" />
          </span>
          <span className="inline-flex sm:hidden">
            <Logo logoUrl={logoUrl} variant="compact" />
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "relative py-1 text-sm tracking-wide uppercase transition-colors",
                  active ? "text-gold-light" : "text-cream/85 hover:text-gold-light"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 h-px w-full bg-gold animate-grow-line" />
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/booking"
          className="hidden lg:inline-flex items-center px-6 py-2.5 text-xs font-medium uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light transition-colors rounded-sm"
        >
          Plan Your Visit
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="lg:hidden text-gold-light p-2"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div
        className={clsx(
          "lg:hidden overflow-hidden transition-[max-height] duration-500 ease-in-out",
          mobileOpen ? "max-h-[420px]" : "max-h-0"
        )}
      >
        <div className="bg-gradient-to-b from-background-brown to-purple border-t border-gold/20 px-6 py-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "py-3 text-sm uppercase tracking-wide border-b border-gold/10",
                pathname === link.href ? "text-gold-light" : "text-cream/85"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="mt-4 inline-flex items-center justify-center px-6 py-3 text-xs font-medium uppercase tracking-wider bg-gold text-text-dark rounded-sm"
          >
            Plan Your Visit
          </Link>
        </div>
      </div>
    </header>
  );
}
