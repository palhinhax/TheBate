import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Thebate - Global Discussion Platform",
  description:
    "Join intelligent discussions about technology, society, and culture from around the world. Share ideas, learn, and connect with respect.",
  alternates: {
    languages: {
      en: "https://thebatee.com?lang=en",
      pt: "https://thebatee.com?lang=pt",
      es: "https://thebatee.com?lang=es",
      fr: "https://thebatee.com?lang=fr",
      de: "https://thebatee.com?lang=de",
    },
  },
  openGraph: {
    title: "Thebate - Global Discussion Platform",
    description:
      "Join intelligent discussions about technology, society, and culture from around the world.",
    url: "https://thebatee.com",
    siteName: "Thebate",
    locale: "en_US",
    alternateLocale: ["pt_PT", "es_ES", "fr_FR", "de_DE"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thebate - Global Discussion Platform",
    description:
      "Join intelligent discussions about technology, society, and culture from around the world.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9458046359698653"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
