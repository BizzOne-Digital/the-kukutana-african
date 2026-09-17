"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Info,
  LayoutGrid,
  DollarSign,
  CalendarCheck,
  MessageSquareQuote,
  Image as ImageIcon,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";
import clsx from "clsx";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/home", label: "Home", icon: Home },
  { href: "/admin/about", label: "About", icon: Info },
  { href: "/admin/services", label: "Collections", icon: LayoutGrid },
  { href: "/admin/pricing", label: "Pricing", icon: DollarSign },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/messages", label: "Contact Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-background-brown border-r border-gold/15 lg:min-h-screen">
      <div className="px-6 py-6 border-b border-gold/15">
        <span className="font-serif-heading text-gold-light text-lg tracking-wide">KUKUTANA</span>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-muted mt-1">Admin Panel</span>
      </div>

      <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible py-3 lg:py-4">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-6 py-3 text-sm whitespace-nowrap transition-colors border-l-2",
                active
                  ? "border-gold text-gold-light bg-gold/5"
                  : "border-transparent text-cream/70 hover:text-gold-light hover:bg-gold/5"
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 text-sm text-cream/70 hover:text-red-300 border-l-2 border-transparent whitespace-nowrap"
        >
          <LogOut size={17} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
