import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
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
      <head>
        {/* Cookie consent + GTM: CSS, config, and script must load in <head> before body */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <>
            <link rel="stylesheet" href="/cookieconsent.css" precedence="default" />
            <Script
              id="cookieconsent-config"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.cookieconsentConfig={gtmId:"${process.env.NEXT_PUBLIC_GTM_ID}"};`,
              }}
            />
            <Script
              id="cookieconsent"
              src="/cookieconsent.js"
              strategy="beforeInteractive"
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
