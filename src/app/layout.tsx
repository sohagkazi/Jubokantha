import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalSettingsProvider } from "@/components/global-settings-provider";

export const metadata: Metadata = {
  title: "JUBOKANTHA Society",
  description: "JUBOKANTHA Society - We Serve Humanity",
};

import { AuthProvider } from "@/contexts/AuthContext";
import { BottomNav } from "@/components/BottomNav";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { CapacitorInit } from "@/components/CapacitorInit";
import { GlobalDonationBanner } from "@/components/global-donation-banner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`min-h-screen flex flex-col font-sans antialiased bg-background text-foreground pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pb-16 md:pb-0`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <GlobalSettingsProvider>
              <LanguageProvider>
                <CapacitorInit />
                <OfflineIndicator />
                <Navbar />
                <main className="flex-1 w-full">
                  {children}
                </main>
                <GlobalDonationBanner />
                <Footer />
                <BottomNav />
              </LanguageProvider>
            </GlobalSettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
