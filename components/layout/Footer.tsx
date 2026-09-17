import Link from "next/link";
import { Mail, Phone, Globe } from "lucide-react";
import Logo from "./Logo";
import { FOOTER_LINKS } from "@/lib/constants";
import type { ISiteSettings } from "@/models/SiteSettings";

type IconProps = { size?: number };

function FacebookIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7C16.4 3.66 15.4 3.58 14.24 3.58c-2.42 0-4.08 1.48-4.08 4.2v2.12H7.45v3.1h2.71V21h3.34Z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.2 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3.5 8.98h3v11.52h-3V8.98Zm6.6 0h2.87v1.58h.04c.4-.75 1.38-1.55 2.85-1.55 3.05 0 3.6 2 3.6 4.6v6.9h-3v-6.12c0-1.46-.03-3.34-2.04-3.34-2.04 0-2.35 1.6-2.35 3.24v6.22h-2.97V8.98Z" />
    </svg>
  );
}

function TikTokIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82c-.9-.63-1.52-1.6-1.72-2.72h-3.05v13.06c0 1.4-1.14 2.54-2.54 2.54a2.54 2.54 0 0 1-2.54-2.54 2.54 2.54 0 0 1 2.54-2.54c.28 0 .55.05.8.13V10.7a5.6 5.6 0 0 0-.8-.06 5.6 5.6 0 0 0-5.6 5.6A5.6 5.6 0 0 0 9.29 21.84a5.6 5.6 0 0 0 5.6-5.6V9.4a8.1 8.1 0 0 0 4.71 1.5V7.86a4.85 4.85 0 0 1-3-2.04Z" />
    </svg>
  );
}

interface FooterProps {
  settings: Partial<ISiteSettings> | null;
}

export default function Footer({ settings }: FooterProps) {
  const socials = [
    { url: settings?.facebook, label: "Facebook", Icon: FacebookIcon },
    { url: settings?.instagram, label: "Instagram", Icon: InstagramIcon },
    { url: settings?.tiktok, label: "TikTok", Icon: TikTokIcon },
    { url: settings?.youtube, label: "YouTube", Icon: YoutubeIcon },
    { url: settings?.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  ].filter((s) => !!s.url);

  return (
    <footer className="bg-background-dark border-t border-gold/20 pattern-kente">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-14 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <Logo logoUrl={settings?.logoUrl} variant="footer" />
          <p className="mt-6 text-sm text-muted leading-relaxed max-w-xs">
            {settings?.footerText || "A Stronger Tomorrow Lives in Our History."}
          </p>
        </div>

        <div>
          <h3 className="text-gold-light text-xs tracking-[0.25em] uppercase mb-5">Navigate</h3>
          <ul className="space-y-3">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-cream/80 hover:text-gold-light transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-gold-light text-xs tracking-[0.25em] uppercase mb-5">Contact</h3>
          <ul className="space-y-3 text-sm text-cream/80">
            {settings?.email && (
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 text-gold shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold-light break-all">
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.directPhone && (
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 text-gold shrink-0" />
                <a href={`tel:${settings.directPhone.replace(/[^\d+]/g, "")}`} className="hover:text-gold-light">
                  {settings.directPhone}
                </a>
              </li>
            )}
            {settings?.website && (
              <li className="flex items-start gap-2">
                <Globe size={16} className="mt-0.5 text-gold shrink-0" />
                <span>{settings.website}</span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-gold-light text-xs tracking-[0.25em] uppercase mb-5">Museum Business</h3>
          <ul className="space-y-3 text-sm text-cream/80">
            {[settings?.businessPhone1, settings?.businessPhone2, settings?.businessPhone3]
              .filter(Boolean)
              .map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone!.replace(/[^\d+]/g, "")}`} className="hover:text-gold-light">
                    {phone}
                  </a>
                </li>
              ))}
          </ul>

          {socials.length > 0 && (
            <div className="mt-6 flex items-center gap-4">
              {socials.map(({ url, label, Icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-cream/70 hover:text-gold-light transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="gold-divider mx-6 sm:mx-10 lg:mx-14" />

      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-14 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <p>&copy; {new Date().getFullYear()} {settings?.museumName || "Kukutana African American History & Culture Museum"}. All rights reserved.</p>
        <Link href="/admin/login" className="hover:text-gold-light">
          Admin
        </Link>
      </div>
    </footer>
  );
}
