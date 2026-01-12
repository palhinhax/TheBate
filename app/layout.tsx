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
import { GoogleAnalytics } from "@/components/google-analytics";

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
      "TheBatee - Create Debates, Vote on Topics & Share Your Opinion | Global Discussion Platform",
    template: "%s | TheBatee",
  },
  description:
    "Create your own debate online, vote on controversial topics, and share your opinion. Free platform for public discussions in 12 languages. Join thousands debating technology, politics, society, and culture.",
  keywords: [
    "create debate online",
    "vote on topics",
    "public opinion polls",
    "online voting platform",
    "controversial topics",
    "debate platform",
    "discussion forum",
    "global debate",
    "multilingual forum",
    "technology debate",
    "political discussion",
    "society debate",
    "culture discussion",
    "AI debate",
    "online polls",
    "free debate platform",
    "create poll",
    "share opinion",
    "public debate",
    "vote online",
    "discussion platform",
    "forum debate",
    "community voting",
    "internacional forum",
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
    title: "TheBatee - Create Debates, Vote on Topics & Share Your Opinion",
    description:
      "Free platform to create debates, vote on controversial topics, and share your opinion. Join global discussions in 12 languages.",
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
    title: "TheBatee - Create Debates & Vote on Topics",
    description:
      "Free platform to create debates, vote on controversial topics, and share your opinion. Join global discussions.",
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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <GoogleAnalytics />
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
