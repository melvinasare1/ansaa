import type { Metadata } from "next";
import { Suspense } from "react";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GaPageViews } from "@/components/analytics/GaPageViews";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { getGaMeasurementId } from "@/lib/ga";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Ansaa: Storefronts, and fulfilment if you want it",
  description:
    "A storefront and admin dashboard you run yourself, plus an optional fulfilment add-on where we pack and send every order.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaMeasurementId = getGaMeasurementId();

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body">
        {children}
        <Analytics />
        {gaMeasurementId ? (
          <>
            <GoogleAnalytics measurementId={gaMeasurementId} />
            <Suspense fallback={null}>
              <GaPageViews />
            </Suspense>
          </>
        ) : null}
      </body>
    </html>
  );
}
