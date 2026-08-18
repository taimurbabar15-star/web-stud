import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BKMSFX — Trading Education & Premium Photography",
  description: "BKMSFX combines premium market education programs, VIP trading tools, and professional cinematic photography portfolio services into one luxury fintech & creator platform.",
  keywords: ["BKMSFX", "Trading Education", "Forex Strategy", "Order Blocks", "Liquidity", "VIP Membership", "Photography Portfolio", "Booking Engine", "Portrait Session", "Automotive Photography"],
  authors: [{ name: "BKMSFX Team", url: "https://bkmsfx.com" }],
  metadataBase: new URL("https://bkmsfx.com"),
  openGraph: {
    title: "BKMSFX — Trading Education & Premium Photography",
    description: "BKMSFX combines premium market education programs, VIP trading tools, and professional cinematic photography portfolio services into one luxury fintech & creator platform.",
    url: "/",
    siteName: "BKMSFX",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BKMSFX — Trading Education & Premium Photography",
    description: "BKMSFX combines premium market education programs, VIP trading tools, and professional cinematic photography portfolio services into one luxury fintech & creator platform.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-brand-black-deep text-brand-text-primary-gray font-sans selection:bg-brand-gold-premium selection:text-brand-black-deep">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
