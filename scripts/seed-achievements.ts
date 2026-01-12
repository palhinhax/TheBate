import { prisma } from "../lib/prisma";

const achievements = [
  // Voting achievements
  {
    key: "first_vote",
    name: {
      en: "First Vote",
      pt: "Primeiro Voto",
      es: "Primer Voto",
      fr: "Premier Vote",
      de: "Erste Stimme",
    },
    description: {
      en: "Cast your first vote on a topic",
      pt: "Votaste no teu primeiro tema",
      es: "Has votado en tu primer tema",
      fr: "Votez sur votre premier sujet",
      de: "Stimmen Sie zum ersten Mal ab",
    },
    icon: "🗳️",
    tier: "BRONZE",
    requirement: 1,
  },
  {
    key: "active_voter",
    name: {
      en: "Active Voter",
      pt: "Votante Ativo",
      es: "Votante Activo",
      fr: "Votant Actif",
      de: "Aktiver Wähler",
    },
    description: {
      en: "Vote on 10 different topics",
      pt: "Votaste em 10 temas diferentes",
      es: "Has votado en 10 temas diferentes",
      fr: "Votez sur 10 sujets différents",
      de: "Stimmen Sie über 10 verschiedene Themen ab",
    },
    icon: "🎯",
    tier: "SILVER",
    requirement: 10,
  },
  {
    key: "voting_enthusiast",
    name: {
      en: "Voting Enthusiast",
      pt: "Entusiasta de Votos",
      es: "Entusiasta del Voto",
      fr: "Enthousiaste du Vote",
      de: "Abstimmungsenthusiast",
    },
    description: {
      en: "Vote on 50 different topics",
      pt: "Votaste em 50 temas diferentes",
      es: "Has votado en 50 temas diferentes",
      fr: "Votez sur 50 sujets différents",
      de: "Stimmen Sie über 50 verschiedene Themen ab",
    },
    icon: "⭐",
    tier: "GOLD",
    requirement: 50,
  },

  // Topic creation achievements
  {
    key: "debate_starter",
    name: {
      en: "Debate Starter",
      pt: "Iniciador de Debate",
      es: "Iniciador de Debate",
      fr: "Lanceur de Débat",
      de: "Debatteninitiator",
    },
    description: {
      en: "Create your first topic",
      pt: "Criaste o teu primeiro tema",
      es: "Has creado tu primer tema",
      fr: "Créez votre premier sujet",
      de: "Erstellen Sie Ihr erstes Thema",
    },
    icon: "🎤",
    tier: "BRONZE",
    requirement: 1,
  },
  {
    key: "topic_creator",
    name: {
      en: "Topic Creator",
      pt: "Criador de Temas",
      es: "Creador de Temas",
      fr: "Créateur de Sujets",
      de: "Themenersteller",
    },
    description: {
      en: "Create 5 topics",
      pt: "Criaste 5 temas",
      es: "Has creado 5 temas",
      fr: "Créez 5 sujets",
      de: "Erstellen Sie 5 Themen",
    },
    icon: "🎨",
    tier: "SILVER",
    requirement: 5,
  },
  {
    key: "debate_master",
    name: {
      en: "Debate Master",
      pt: "Mestre de Debates",
      es: "Maestro del Debate",
      fr: "Maître du Débat",
      de: "Debattenmeister",
    },
    description: {
      en: "Create 20 topics",
      pt: "Criaste 20 temas",
      es: "Has creado 20 temas",
      fr: "Créez 20 sujets",
      de: "Erstellen Sie 20 Themen",
    },
    icon: "👑",
    tier: "GOLD",
    requirement: 20,
  },

  // Comment achievements
  {
    key: "first_comment",
    name: {
      en: "First Comment",
      pt: "Primeiro Comentário",
      es: "Primer Comentario",
      fr: "Premier Commentaire",
      de: "Erster Kommentar",
    },
    description: {
      en: "Post your first comment",
      pt: "Fizeste o teu primeiro comentário",
      es: "Has publicado tu primer comentario",
      fr: "Publiez votre premier commentaire",
      de: "Posten Sie Ihren ersten Kommentar",
    },
    icon: "💬",
    tier: "BRONZE",
    requirement: 1,
  },
  {
    key: "active_commenter",
    name: {
      en: "Active Commenter",
      pt: "Comentador Ativo",
      es: "Comentarista Activo",
      fr: "Commentateur Actif",
      de: "Aktiver Kommentator",
    },
    description: {
      en: "Post 10 comments",
      pt: "Fizeste 10 comentários",
      es: "Has publicado 10 comentarios",
      fr: "Publiez 10 commentaires",
      de: "Posten Sie 10 Kommentare",
    },
    icon: "💭",
    tier: "SILVER",
    requirement: 10,
  },
  {
    key: "discussion_expert",
    name: {
      en: "Discussion Expert",
      pt: "Especialista em Discussões",
      es: "Experto en Discusiones",
      fr: "Expert en Discussion",
      de: "Diskussionsexperte",
    },
    description: {
      en: "Post 50 comments",
      pt: "Fizeste 50 comentários",
      es: "Has publicado 50 comentarios",
      fr: "Publiez 50 commentaires",
      de: "Posten Sie 50 Kommentare",
    },
    icon: "🎓",
    tier: "GOLD",
    requirement: 50,
  },
  {
    key: "discussion_master",
    name: {
      en: "Discussion Master",
      pt: "Mestre das Discussões",
      es: "Maestro de las Discusiones",
      fr: "Maître de la Discussion",
      de: "Diskussionsmeister",
    },
    description: {
      en: "Post 100 comments",
      pt: "Fizeste 100 comentários",
      es: "Has publicado 100 comentarios",
      fr: "Publiez 100 commentaires",
      de: "Posten Sie 100 Kommentare",
    },
    icon: "🏆",
    tier: "GOLD",
    requirement: 100,
  },

  // Karma achievements
  {
    key: "karma_100",
    name: {
      en: "Rising Star",
      pt: "Estrela em Ascensão",
      es: "Estrella Ascendente",
      fr: "Étoile Montante",
      de: "Aufsteigender Stern",
    },
    description: {
      en: "Reach 100 karma points",
      pt: "Alcançaste 100 pontos de karma",
      es: "Has alcanzado 100 puntos de karma",
      fr: "Atteignez 100 points de karma",
      de: "Erreichen Sie 100 Karma-Punkte",
    },
    icon: "🌟",
    tier: "SILVER",
    requirement: 100,
  },
  {
    key: "karma_500",
    name: {
      en: "Influential Voice",
      pt: "Voz Influente",
      es: "Voz Influyente",
      fr: "Voix Influente",
      de: "Einflussreiche Stimme",
    },
    description: {
      en: "Reach 500 karma points",
      pt: "Alcançaste 500 pontos de karma",
      es: "Has alcanzado 500 puntos de karma",
      fr: "Atteignez 500 points de karma",
      de: "Erreichen Sie 500 Karma-Punkte",
    },
    icon: "💎",
    tier: "GOLD",
    requirement: 500,
  },
  {
    key: "karma_1000",
    name: {
      en: "Legend",
      pt: "Lenda",
      es: "Leyenda",
      fr: "Légende",
      de: "Legende",
    },
    description: {
      en: "Reach 1000 karma points",
      pt: "Alcançaste 1000 pontos de karma",
      es: "Has alcanzado 1000 puntos de karma",
      fr: "Atteignez 1000 points de karma",
      de: "Erreichen Sie 1000 Karma-Punkte",
    },
    icon: "🏅",
    tier: "PLATINUM",
    requirement: 1000,
  },
];

async function main() {
  console.log("🎖️  Starting achievement seed...");

  for (const achievement of achievements) {
    const existing = await prisma.achievement.findUnique({
      where: { key: achievement.key },
    });

    if (existing) {
      console.log(`⏭️  Achievement "${achievement.key}" already exists, skipping...`);
      continue;
    }

    await prisma.achievement.create({
      data: achievement,
    });

    console.log(`✅ Created achievement: ${achievement.key} (${achievement.tier})`);
  }

  console.log("✨ Achievement seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Achievement seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
