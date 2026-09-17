"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import type { ISiteSettings } from "@/models/SiteSettings";

export default function SiteChrome({
  settings,
  children,
}: {
  settings: Partial<ISiteSettings>;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header logoUrl={settings.logoUrl} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
