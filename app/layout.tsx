import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AdSenseScript } from "@/components/adsense-script";

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
  metadataBase: new URL("https://thebatee.com"),
  title: {
    default:
      "Thebatee - Global Discussion Platform | Multilingual Debate Forum",
    template: "%s | Thebatee",
  },
  description:
    "Join intelligent discussions about technology, society, and culture from around the world. Share ideas, learn, and connect with respect. Available in English, Portuguese, Spanish, French, and German.",
  keywords: [
    "debate",
    "discussion",
    "forum",
    "global",
    "multilingual",
    "technology",
    "society",
    "culture",
    "AI",
    "politics",
    "debate forum",
    "online discussion",
    "community",
    "português",
    "english",
    "español",
    "français",
    "deutsch",
    "debatte",
    "débat",
    "discusión",
    "discussão",
  ],
  authors: [{ name: "Thebatee Team" }],
  creator: "Thebatee",
  publisher: "Thebatee",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://thebatee.com",
    languages: {
      "en-US": "https://thebatee.com?lang=en",
      "pt-PT": "https://thebatee.com?lang=pt",
      "es-ES": "https://thebatee.com?lang=es",
      "fr-FR": "https://thebatee.com?lang=fr",
      "de-DE": "https://thebatee.com?lang=de",
      "x-default": "https://thebatee.com",
    },
  },
  openGraph: {
    title: "Thebatee - Global Discussion Platform",
    description:
      "Join intelligent discussions about technology, society, and culture in multiple languages.",
    url: "https://thebatee.com",
    siteName: "Thebatee",
    locale: "en_US",
    alternateLocale: ["pt_PT", "es_ES", "fr_FR", "de_DE"],
    type: "website",
    images: [
      {
        url: "https://thebatee.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Thebatee - Global Discussion Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thebatee - Global Discussion Platform",
    description:
      "Join intelligent discussions about technology, society, and culture in multiple languages.",
    creator: "@thebatee",
    site: "@thebatee",
    images: ["https://thebatee.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <AdSenseScript />
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
