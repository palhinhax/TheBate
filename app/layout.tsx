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
      "TheBatee - Global Discussion Platform | Multilingual Debate Forum",
    template: "%s | TheBatee",
  },
  description:
    "Join intelligent discussions about technology, society, and culture from around the world. Share ideas, learn, and connect with respect. Available in 12 languages: English, Portuguese, Spanish, French, German, Hindi, Chinese, Arabic, Bengali, Russian, Indonesian, and Japanese.",
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
    "international forum",
    "world debate",
    "português",
    "english",
    "español",
    "français",
    "deutsch",
    "हिन्दी",
    "中文",
    "العربية",
    "বাংলা",
    "русский",
    "bahasa indonesia",
    "日本語",
    "debatte",
    "débat",
    "discusión",
    "discussão",
    "controversial topics",
    "public debate",
    "free speech",
    "opinion sharing",
  ],
  authors: [{ name: "TheBatee Team" }],
  creator: "TheBatee",
  publisher: "TheBatee",
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
      "hi-IN": "https://thebatee.com?lang=hi",
      "zh-CN": "https://thebatee.com?lang=zh",
      "ar-SA": "https://thebatee.com?lang=ar",
      "bn-BD": "https://thebatee.com?lang=bn",
      "ru-RU": "https://thebatee.com?lang=ru",
      "id-ID": "https://thebatee.com?lang=id",
      "ja-JP": "https://thebatee.com?lang=ja",
      "x-default": "https://thebatee.com",
    },
  },
  openGraph: {
    title: "TheBatee - Global Discussion Platform",
    description:
      "Join intelligent discussions about technology, society, and culture in multiple languages.",
    url: "https://thebatee.com",
    siteName: "TheBatee",
    locale: "en_US",
    alternateLocale: [
      "pt_PT",
      "es_ES",
      "fr_FR",
      "de_DE",
      "hi_IN",
      "zh_CN",
      "ar_SA",
      "bn_BD",
      "ru_RU",
      "id_ID",
      "ja_JP",
    ],
    type: "website",
    images: [
      {
        url: "https://thebatee.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "TheBatee - Global Discussion Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TheBatee - Global Discussion Platform",
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
