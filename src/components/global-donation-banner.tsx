"use client"
import { usePathname } from "next/navigation"
import { DonationBanner } from "@/components/donation-banner"

export function GlobalDonationBanner() {
  const pathname = usePathname();
  // Don't show the global donation banner on admin pages or auth pages
  if (pathname.startsWith('/admin') || pathname === '/login' || pathname === '/signup') {
    return null;
  }
  return <DonationBanner />;
}
