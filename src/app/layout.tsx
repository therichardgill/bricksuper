import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Toaster } from "sonner";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BrickSuper — SMSF Property Education",
    template: "%s | BrickSuper",
  },
  description:
    "Educational tools and plain-English guides to help you understand SMSF property investment rules, costs, and risks.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://bricksuper.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "BrickSuper",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${dmSerif.variable} ${dmSans.variable} h-full antialiased`}
    >
      {/* CookieYes consent banner — must load before GTM so consent state is available */}
      {process.env.NEXT_PUBLIC_COOKIEYES_ID && (
        <Script
          id="cookieyes"
          src={`https://cdn-cookieyes.com/client_data/${process.env.NEXT_PUBLIC_COOKIEYES_ID}/script.js`}
          strategy="beforeInteractive"
        />
      )}
      {/* GTM container — reads CookieYes consent state via Consent Mode v2 */}
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
