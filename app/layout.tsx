import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import SiteChrome from "@/components/layout/SiteChrome";
import { getSiteSettings } from "@/lib/data/getSiteSettings";
import "./globals.css";

export const dynamic = "force-dynamic";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.seoTitle,
      template: `%s | ${settings.shortMuseumName}`,
    },
    description: settings.seoDescription,
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      siteName: settings.museumName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
    },
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Museum",
    name: settings.museumName,
    description: settings.seoDescription,
    url: siteUrl,
    email: settings.email,
    telephone: settings.directPhone,
  };

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background-dark">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <SiteChrome settings={settings}>{children}</SiteChrome>
      </body>
    </html>
  );
}
