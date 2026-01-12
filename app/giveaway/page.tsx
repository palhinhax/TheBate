import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gift, CheckCircle2, XCircle } from "lucide-react";
import { GiveawayEntryButton } from "./giveaway-entry-button";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "en";
  const locale = acceptLanguage.split(",")[0].split("-")[0].toLowerCase();

  const translations: Record<string, { title: string; description: string; keywords: string }> = {
    en: {
      title: "Win €50 Amazon Gift Card - Free Giveaway | TheBatee",
      description:
        "Enter our free giveaway and win €50 Amazon Gift Card. No purchase necessary. Just create an account and vote in any debate. Open to everyone 18+.",
      keywords:
        "giveaway, win money, free amazon gift card, contest, sweepstakes, win €50, debate platform",
    },
    pt: {
      title: "Ganha Cartão Amazon de €50 - Sorteio Grátis | TheBatee",
      description:
        "Participa no nosso sorteio grátis e ganha um Cartão Amazon de €50. Não é necessária compra. Basta criar conta e votar num debate. Aberto a maiores de 18 anos.",
      keywords:
        "sorteio, ganhar dinheiro, cartão amazon grátis, concurso, passatempo, ganhar €50, plataforma de debates",
    },
    es: {
      title: "Gana Tarjeta Amazon de €50 - Sorteo Gratis | TheBatee",
      description:
        "Participa en nuestro sorteo gratis y gana una Tarjeta Amazon de €50. Sin necesidad de compra. Solo crea una cuenta y vota en un debate. Abierto a mayores de 18 años.",
      keywords:
        "sorteo, ganar dinero, tarjeta amazon gratis, concurso, premios, ganar €50, plataforma de debates",
    },
    fr: {
      title: "Gagnez Carte Cadeau Amazon €50 - Concours Gratuit | TheBatee",
      description:
        "Participez à notre concours gratuit et gagnez une Carte Cadeau Amazon de €50. Aucun achat requis. Créez simplement un compte et votez dans un débat. Ouvert aux 18 ans et plus.",
      keywords:
        "concours, gagner argent, carte cadeau amazon gratuite, jeu-concours, tirage au sort, gagner €50, plateforme de débats",
    },
    de: {
      title: "Gewinne €50 Amazon Geschenkkarte - Kostenloses Gewinnspiel | TheBatee",
      description:
        "Nimm an unserem kostenlosen Gewinnspiel teil und gewinne eine €50 Amazon Geschenkkarte. Kein Kauf erforderlich. Erstelle einfach ein Konto und stimme in einer Debatte ab. Offen für alle ab 18 Jahren.",
      keywords:
        "gewinnspiel, geld gewinnen, kostenlose amazon geschenkkarte, verlosung, preisausschreiben, €50 gewinnen, debattenplattform",
    },
    hi: {
      title: "€50 Amazon गिफ्ट कार्ड जीतें - मुफ्त गिवअवे | TheBatee",
      description:
        "हमारे मुफ्त गिवअवे में शामिल हों और €50 Amazon गिफ्ट कार्ड जीतें। कोई खरीदारी आवश्यक नहीं। बस एक खाता बनाएं और किसी भी बहस में वोट करें। 18+ के लिए खुला।",
      keywords:
        "गिवअवे, पैसे जीतें, मुफ्त amazon गिफ्ट कार्ड, प्रतियोगिता, ड्रा, €50 जीतें, बहस मंच",
    },
    bn: {
      title: "€50 Amazon গিফট কার্ড জিতুন - বিনামূল্যে গিভঅ্যাওয়ে | TheBatee",
      description:
        "আমাদের বিনামূল্যে গিভঅ্যাওয়েতে প্রবেশ করুন এবং €50 Amazon গিফট কার্ড জিতুন। কোনো ক্রয়ের প্রয়োজন নেই। শুধু একটি অ্যাকাউন্ট তৈরি করুন এবং যেকোনো বিতর্কে ভোট দিন। 18+ এর জন্য খোলা।",
      keywords:
        "গিভঅ্যাওয়ে, টাকা জিতুন, বিনামূল্যে amazon গিফট কার্ড, প্রতিযোগিতা, লটারি, €50 জিতুন, বিতর্ক প্ল্যাটফর্ম",
    },
    zh: {
      title: "赢取€50亚马逊礼品卡 - 免费赠品 | TheBatee",
      description:
        "参加我们的免费赠品活动，赢取€50亚马逊礼品卡。无需购买。只需创建账户并在任何辩论中投票。面向18岁以上人士开放。",
      keywords: "赠品, 赢钱, 免费亚马逊礼品卡, 竞赛, 抽奖, 赢€50, 辩论平台",
    },
    ru: {
      title: "Выиграйте подарочную карту Amazon €50 - Бесплатный розыгрыш | TheBatee",
      description:
        "Примите участие в нашем бесплатном розыгрыше и выиграйте подарочную карту Amazon на €50. Покупка не требуется. Просто создайте аккаунт и проголосуйте в любых дебатах. Открыто для лиц старше 18 лет.",
      keywords:
        "розыгрыш, выиграть деньги, бесплатная подарочная карта amazon, конкурс, лотерея, выиграть €50, платформа дебатов",
    },
    ja: {
      title: "€50 Amazonギフトカードを獲得 - 無料ギブアウェイ | TheBatee",
      description:
        "無料ギブアウェイに参加して€50 Amazonギフトカードを獲得しましょう。購入不要。アカウントを作成して討論に投票するだけ。18歳以上が対象。",
      keywords:
        "ギブアウェイ, お金を稼ぐ, 無料amazonギフトカード, コンテスト, 抽選, €50獲得, 討論プラットフォーム",
    },
    ar: {
      title: "اربح بطاقة هدايا أمازون €50 - سحب مجاني | TheBatee",
      description:
        "شارك في السحب المجاني واربح بطاقة هدايا أمازون بقيمة €50. لا حاجة للشراء. فقط أنشئ حسابًا وصوت في أي نقاش. متاح لمن هم فوق 18 عامًا.",
      keywords: "سحب, ربح المال, بطاقة هدايا أمازون مجانية, مسابقة, يانصيب, ربح €50, منصة نقاش",
    },
    id: {
      title: "Menangkan Kartu Hadiah Amazon €50 - Undian Gratis | TheBatee",
      description:
        "Ikuti undian gratis kami dan menangkan Kartu Hadiah Amazon €50. Tidak perlu membeli. Cukup buat akun dan berikan suara dalam debat apa pun. Terbuka untuk 18+ tahun.",
      keywords:
        "undian, menang uang, kartu hadiah amazon gratis, kontes, giveaway, menang €50, platform debat",
    },
  };

  const t = translations[locale] || translations.en;

  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    openGraph: {
      title: t.title,
      description: t.description,
      type: "website",
      url: "https://thebatee.com/giveaway",
      siteName: "TheBatee",
      images: [
        {
          url: "https://thebatee.com/images/giveaway-og.jpg",
          width: 1200,
          height: 630,
          alt: "Win €50 Amazon Gift Card - TheBatee Giveaway",
        },
      ],
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: ["https://thebatee.com/images/giveaway-og.jpg"],
    },
    alternates: {
      canonical: "https://thebatee.com/giveaway",
      languages: {
        en: "https://thebatee.com/giveaway",
        pt: "https://thebatee.com/giveaway",
        es: "https://thebatee.com/giveaway",
        fr: "https://thebatee.com/giveaway",
        de: "https://thebatee.com/giveaway",
        hi: "https://thebatee.com/giveaway",
        bn: "https://thebatee.com/giveaway",
        zh: "https://thebatee.com/giveaway",
        ru: "https://thebatee.com/giveaway",
        ja: "https://thebatee.com/giveaway",
        ar: "https://thebatee.com/giveaway",
        id: "https://thebatee.com/giveaway",
      },
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
  };
}

async function getActiveGiveaway() {
  const now = new Date();

  const giveaway = await prisma.giveaway.findFirst({
    where: {
      status: "ACTIVE",
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: {
      winner: {
        select: {
          username: true,
          name: true,
        },
      },
      _count: {
        select: {
          entries: true,
        },
      },
    },
  });

  return giveaway;
}

async function getUserEntry(userId: string, giveawayId: string) {
  const entry = await prisma.giveawayEntry.findUnique({
    where: {
      giveawayId_userId: {
        giveawayId,
        userId,
      },
    },
  });

  return entry;
}

async function hasUserVoted(userId: string) {
  const voteCount = await prisma.topicVote.count({
    where: { userId },
  });

  return voteCount > 0;
}

export default async function GiveawayPage() {
  const session = await auth();
  const giveaway = await getActiveGiveaway();

  if (!giveaway) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-lg border bg-card p-12 text-center">
          <XCircle className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">No Active Giveaway</h1>
          <p className="mt-2 text-muted-foreground">
            There is no active giveaway at the moment. Check back soon!
          </p>
          <Link href="/">
            <Button className="mt-6">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const userEntry = session?.user?.id ? await getUserEntry(session.user.id, giveaway.id) : null;
  const hasVoted = session?.user?.id ? await hasUserVoted(session.user.id) : false;

  const title =
    typeof giveaway.title === "object"
      ? (giveaway.title as Record<string, string>).en || ""
      : giveaway.title;

  const description =
    typeof giveaway.description === "object"
      ? (giveaway.description as Record<string, string>).en || ""
      : giveaway.description;

  const daysLeft = Math.ceil(
    (new Date(giveaway.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  // Structured data for SEO (Schema.org)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Sweepstakes",
    name: title,
    description: description,
    sponsor: {
      "@type": "Organization",
      name: "TheBatee",
      url: "https://thebatee.com",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      eligibleRegion: {
        "@type": "Place",
        name: "Worldwide",
      },
    },
    prize: {
      "@type": "Offer",
      name: giveaway.prize,
      price: "50",
      priceCurrency: "EUR",
    },
    startDate: giveaway.startDate.toISOString(),
    endDate: giveaway.endDate.toISOString(),
    url: "https://thebatee.com/giveaway",
    image: "https://thebatee.com/images/giveaway-og.jpg",
    participantCount: giveaway._count.entries,
    eligibilityRequirement: "Must be 18 years or older. Create account and vote in any debate.",
    rules: "https://thebatee.com/giveaway",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto max-w-4xl px-4 py-16">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 p-6">
              <Gift className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold">{title}</h1>
          <p className="text-xl text-muted-foreground">{description}</p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="rounded-full bg-amber-100 px-4 py-2 font-semibold text-amber-900 dark:bg-amber-900/30 dark:text-amber-100">
              {daysLeft} {daysLeft === 1 ? "day" : "days"} left
            </span>
            <span className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-900 dark:bg-blue-900/30 dark:text-blue-100">
              {giveaway._count.entries} {giveaway._count.entries === 1 ? "entry" : "entries"}
            </span>
          </div>
        </div>

        {/* Entry Status */}
        {session?.user ? (
          <div className="mb-12">
            {userEntry ? (
              <div className="rounded-lg border border-green-500 bg-green-50 p-6 text-center dark:bg-green-950/30">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 dark:text-green-400" />
                <h2 className="mt-4 text-xl font-bold text-green-900 dark:text-green-100">
                  You&apos;re Entered!
                </h2>
                <p className="mt-2 text-green-700 dark:text-green-300">
                  You&apos;ve successfully entered the giveaway. Winner will be announced on{" "}
                  {new Date(giveaway.endDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  .
                </p>
                {!userEntry.hasVoted && (
                  <p className="mt-4 text-sm text-green-600 dark:text-green-400">
                    💡 Tip: Vote in a debate to complete your entry!
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border bg-card p-8 text-center">
                <h2 className="mb-4 text-2xl font-bold">Enter the Giveaway</h2>
                <p className="mb-6 text-muted-foreground">
                  Click below to enter. No purchase necessary!
                </p>
                <GiveawayEntryButton giveawayId={giveaway.id} hasVoted={hasVoted} />
              </div>
            )}
          </div>
        ) : (
          <div className="mb-12 rounded-lg border bg-card p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Sign In to Enter</h2>
            <p className="mb-6 text-muted-foreground">
              Create a free account to enter the giveaway. It takes less than 30 seconds!
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600">
                Create Account & Enter
              </Button>
            </Link>
          </div>
        )}

        {/* Prize Details */}
        <div className="mb-12 rounded-lg border bg-card p-8">
          <h2 className="mb-4 text-2xl font-bold">🎁 Prize</h2>
          <p className="text-lg">{giveaway.prize}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The winner will be contacted via email and the prize will be sent electronically.
          </p>
        </div>

        {/* How to Enter */}
        <div className="mb-12 rounded-lg border bg-card p-8">
          <h2 className="mb-6 text-2xl font-bold">📝 How to Enter</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="font-semibold">Create a Free Account</h3>
                <p className="text-sm text-muted-foreground">
                  Sign up with your email or social login. Takes less than 30 seconds.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="font-semibold">Vote in at Least One Debate</h3>
                <p className="text-sm text-muted-foreground">
                  Share your opinion on any debate topic. Your vote is your entry!
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold">Optional: Comment on a Debate</h3>
                <p className="text-sm text-muted-foreground">
                  Share your thoughts to engage with the community (not required for entry).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="rounded-lg border bg-card p-8">
          <h2 className="mb-6 text-2xl font-bold">📜 Official Rules</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Eligibility:</strong> Open to all users 18 years or older. One entry per
              person.
            </p>
            <p>
              <strong>Entry Period:</strong>{" "}
              {new Date(giveaway.startDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              to{" "}
              {new Date(giveaway.endDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p>
              <strong>Winner Selection:</strong> One winner will be selected randomly from all
              eligible entries after the entry period ends.
            </p>
            <p>
              <strong>Winner Notification:</strong> The winner will be contacted via email within 48
              hours of selection and announced publicly on the site.
            </p>
            <p>
              <strong>Prize Delivery:</strong> The prize will be sent electronically to the
              winner&apos;s email address.
            </p>
            <p>
              <strong>No Purchase Necessary:</strong> No purchase or payment is required to enter or
              win.
            </p>
            <p>
              <strong>Affiliation:</strong> This giveaway is not sponsored, endorsed, or
              administered by Amazon or any other brand mentioned. All trademarks are property of
              their respective owners.
            </p>
            <p>
              <strong>Privacy:</strong> Your information will only be used for the giveaway and will
              not be shared with third parties. See our{" "}
              <Link href="/legal/privacy" className="text-primary underline">
                Privacy Policy
              </Link>
              .
            </p>
            <p>
              <strong>Terms:</strong> By entering, you agree to these rules and our{" "}
              <Link href="/legal/terms" className="text-primary underline">
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>

        {/* CTA */}
        {!session?.user && (
          <div className="mt-12 text-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600">
                Create Account & Enter Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
