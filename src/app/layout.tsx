import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import { ConvexClientProvider } from "@/components/convex-client-provider";
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
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
