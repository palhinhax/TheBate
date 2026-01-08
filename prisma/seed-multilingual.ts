import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Multilingual topics data - Controversial & Current Topics
const multilingualTopics = [
  // English - Controversial Current Topics
  {
    slug: "trump-2025-presidency-democracy",
    title: "Trump's 2025 Return: Threat to Democracy or Restoration?",
    description:
      "With Trump back in power, debates rage about the future of American democracy. Some see authoritarian tendencies, others see a necessary correction. What's your take?",
    tags: ["politics", "usa", "democracy", "trump"],
    language: "en",
  },
  {
    slug: "maduro-venezuela-dictatorship-or-resistance",
    title: "Maduro's Venezuela: Dictatorship or Anti-Imperialist Resistance?",
    description:
      "The debate over Venezuela's government continues. Is Maduro a dictator destroying his country, or is he resisting foreign intervention? International perspectives vary wildly.",
    tags: ["venezuela", "maduro", "politics", "latin-america"],
    language: "en",
  },
  {
    slug: "taiwan-china-conflict-inevitable",
    title: "Is War Between China and Taiwan Inevitable?",
    description:
      "Tensions escalate as China increases military pressure on Taiwan. With US involvement likely, could this spark a global conflict? Or is peaceful resolution still possible?",
    tags: ["china", "taiwan", "geopolitics", "war"],
    language: "en",
  },
  {
    slug: "ai-replacing-human-creativity",
    title: "AI Art & Music: Death of Human Creativity?",
    description:
      "AI can now create art, music, and writing indistinguishable from humans. Are we witnessing the end of human creative value, or just a new tool for artists?",
    tags: ["ai", "art", "technology", "creativity"],
    language: "en",
  },
  {
    slug: "climate-activists-too-extreme",
    title: "Are Climate Activists Going Too Far?",
    description:
      "From blocking roads to vandalizing art, climate protesters face backlash. Are these tactics necessary to save the planet, or do they harm the cause?",
    tags: ["climate", "activism", "environment", "protest"],
    language: "en",
  },
  {
    slug: "universal-basic-income-solution",
    title: "Universal Basic Income: Solution or Socialist Fantasy?",
    description:
      "As automation threatens jobs, UBI gains support. Critics call it unrealistic and lazy. Would it free humanity or destroy work ethic?",
    tags: ["ubi", "economy", "automation", "policy"],
    language: "en",
  },
  
  // Portuguese - Tópicos Polêmicos
  {
    slug: "trump-ameaca-democracia-2025",
    title: "Trump em 2025: Ameaça à Democracia ou Restauração?",
    description:
      "Com Trump de volta ao poder, os debates sobre o futuro da democracia americana intensificam-se. Uns veem tendências autoritárias, outros veem uma correção necessária.",
    tags: ["política", "eua", "democracia", "trump"],
    language: "pt",
  },
  {
    slug: "maduro-venezuela-ditadura-resistencia",
    title: "Venezuela de Maduro: Ditadura ou Resistência Anti-Imperialista?",
    description:
      "O debate sobre o governo venezuelano continua. Maduro é um ditador ou está a resistir à intervenção estrangeira? As perspetivas internacionais variam muito.",
    tags: ["venezuela", "maduro", "política", "américa-latina"],
    language: "pt",
  },
  {
    slug: "conflito-china-taiwan-inevitavel",
    title: "Guerra entre China e Taiwan é Inevitável?",
    description:
      "As tensões aumentam com a China a pressionar Taiwan militarmente. Com envolvimento provável dos EUA, isto pode desencadear um conflito global?",
    tags: ["china", "taiwan", "geopolítica", "guerra"],
    language: "pt",
  },
  {
    slug: "ia-substituir-programadores",
    title: "IA vai substituir programadores?",
    description:
      "Com o avanço de ferramentas como ChatGPT e GitHub Copilot, há uma discussão crescente sobre o futuro da profissão de programador.",
    tags: ["tecnologia", "ia", "programação"],
    language: "pt",
  },
  
  // Spanish - Temas Polémicos
  {
    slug: "trump-amenaza-democracia-2025",
    title: "Trump en 2025: ¿Amenaza a la Democracia o Restauración?",
    description:
      "Con Trump de vuelta en el poder, los debates sobre el futuro de la democracia estadounidense se intensifican. Algunos ven tendencias autoritarias, otros una corrección necesaria.",
    tags: ["política", "eeuu", "democracia", "trump"],
    language: "es",
  },
  {
    slug: "maduro-venezuela-dictadura-resistencia",
    title: "Venezuela de Maduro: ¿Dictadura o Resistencia Anti-Imperialista?",
    description:
      "El debate sobre el gobierno venezolano continúa. ¿Maduro es un dictador o está resistiendo la intervención extranjera? Las perspectivas internacionales varían mucho.",
    tags: ["venezuela", "maduro", "política", "latinoamérica"],
    language: "es",
  },
  {
    slug: "conflicto-china-taiwan-inevitable",
    title: "¿Es Inevitable la Guerra entre China y Taiwán?",
    description:
      "Las tensiones aumentan con China presionando militarmente a Taiwán. Con la probable participación de EE.UU., ¿podría esto desencadenar un conflicto global?",
    tags: ["china", "taiwán", "geopolítica", "guerra"],
    language: "es",
  },
  {
    slug: "migracion-crisis-o-oportunidad",
    title: "Migración: ¿Crisis Humanitaria o Oportunidad Económica?",
    description:
      "La migración divide opiniones. ¿Es una crisis que amenaza identidades nacionales o una oportunidad para economías envejecidas?",
    tags: ["migración", "política", "economía", "sociedad"],
    language: "es",
  },
  
  // French - Sujets Polémiques
  {
    slug: "trump-menace-democratie-2025",
    title: "Trump en 2025: Menace pour la Démocratie ou Restauration?",
    description:
      "Avec Trump de retour au pouvoir, les débats sur l'avenir de la démocratie américaine s'intensifient. Certains voient des tendances autoritaires, d'autres une correction nécessaire.",
    tags: ["politique", "usa", "démocratie", "trump"],
    language: "fr",
  },
  {
    slug: "maduro-venezuela-dictature-resistance",
    title: "Venezuela de Maduro: Dictature ou Résistance Anti-Impérialiste?",
    description:
      "Le débat sur le gouvernement vénézuélien continue. Maduro est-il un dictateur ou résiste-t-il à l'intervention étrangère? Les perspectives internationales varient énormément.",
    tags: ["venezuela", "maduro", "politique", "amérique-latine"],
    language: "fr",
  },
  {
    slug: "conflit-chine-taiwan-inevitable",
    title: "La Guerre entre Chine et Taïwan est-elle Inévitable?",
    description:
      "Les tensions augmentent avec la pression militaire chinoise sur Taïwan. Avec l'implication probable des États-Unis, cela pourrait-il déclencher un conflit mondial?",
    tags: ["chine", "taïwan", "géopolitique", "guerre"],
    language: "fr",
  },
  {
    slug: "immigration-europe-debat",
    title: "Immigration en Europe: Enrichissement ou Menace?",
    description:
      "L'immigration divise l'Europe. Est-ce un enrichissement culturel et économique ou une menace pour l'identité européenne?",
    tags: ["immigration", "europe", "politique", "société"],
    language: "fr",
  },
  
  // German - Kontroverse Themen
  {
    slug: "trump-bedrohung-demokratie-2025",
    title: "Trump 2025: Bedrohung für Demokratie oder Wiederherstellung?",
    description:
      "Mit Trumps Rückkehr an die Macht intensivieren sich die Debatten über die Zukunft der amerikanischen Demokratie. Manche sehen autoritäre Tendenzen, andere eine notwendige Korrektur.",
    tags: ["politik", "usa", "demokratie", "trump"],
    language: "de",
  },
  {
    slug: "maduro-venezuela-diktatur-widerstand",
    title: "Maduros Venezuela: Diktatur oder Anti-Imperialistischer Widerstand?",
    description:
      "Die Debatte über die venezolanische Regierung geht weiter. Ist Maduro ein Diktator oder leistet er Widerstand gegen ausländische Einmischung?",
    tags: ["venezuela", "maduro", "politik", "lateinamerika"],
    language: "de",
  },
  {
    slug: "konflikt-china-taiwan-unvermeidlich",
    title: "Ist Krieg zwischen China und Taiwan Unvermeidlich?",
    description:
      "Die Spannungen steigen, da China militärischen Druck auf Taiwan ausübt. Könnte dies mit wahrscheinlicher US-Beteiligung einen globalen Konflikt auslösen?",
    tags: ["china", "taiwan", "geopolitik", "krieg"],
    language: "de",
  },
  {
    slug: "migration-deutschland-herausforderung",
    title: "Migration in Deutschland: Bereicherung oder Überforderung?",
    description:
      "Migration spaltet die Gesellschaft. Ist sie eine kulturelle und wirtschaftliche Bereicherung oder überfordert sie das Sozialsystem?",
    tags: ["migration", "deutschland", "politik", "gesellschaft"],
    language: "de",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.vote.deleteMany();
  await prisma.topicVote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.user.deleteMany();

  // Create password hash
  const passwordHash = await bcrypt.hash("password123", 12);

  // Create users from different countries
  const users = await Promise.all([
    // Portuguese
    prisma.user.create({
      data: {
        email: "maria@example.com",
        username: "maria_silva",
        name: "Maria Silva",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: "joao@example.com",
        username: "joao_santos",
        name: "João Santos",
        passwordHash,
      },
    }),
    // English
    prisma.user.create({
      data: {
        email: "john@example.com",
        username: "john_smith",
        name: "John Smith",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: "sarah@example.com",
        username: "sarah_johnson",
        name: "Sarah Johnson",
        passwordHash,
      },
    }),
    // Spanish
    prisma.user.create({
      data: {
        email: "carlos@example.com",
        username: "carlos_garcia",
        name: "Carlos García",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: "lucia@example.com",
        username: "lucia_rodriguez",
        name: "Lucía Rodríguez",
        passwordHash,
      },
    }),
    // French
    prisma.user.create({
      data: {
        email: "pierre@example.com",
        username: "pierre_martin",
        name: "Pierre Martin",
        passwordHash,
      },
    }),
    // German
    prisma.user.create({
      data: {
        email: "hans@example.com",
        username: "hans_mueller",
        name: "Hans Müller",
        passwordHash,
      },
    }),
  ]);

  // Create admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@thebate.com",
      username: "admin",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`✅ Created ${users.length + 1} users`);

  // Create multilingual topics
  const createdTopics = [];
  for (let i = 0; i < multilingualTopics.length; i++) {
    const topicData = multilingualTopics[i];
    const user = users[i % users.length];
    
    const topic = await prisma.topic.create({
      data: {
        ...topicData,
        createdById: user.id,
      },
    });
    createdTopics.push(topic);
  }

  console.log(`✅ Created ${createdTopics.length} multilingual topics`);

  // Create some comments
  let commentCount = 0;
  for (const topic of createdTopics.slice(0, 5)) {
    // Create 3-5 comments per topic
    const numComments = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < numComments; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const side = ["AFAVOR", "CONTRA"][Math.floor(Math.random() * 2)];
      
      await prisma.comment.create({
        data: {
          content: `This is a comment about ${topic.title}. ${side === "AFAVOR" ? "I agree with this perspective." : "I have some concerns about this."}`,
          side: side as "AFAVOR" | "CONTRA",
          topicId: topic.id,
          userId: user.id,
        },
      });
      commentCount++;
    }
  }

  console.log(`✅ Created ${commentCount} comments`);

  console.log("\n🎉 Seeding completed!");
  console.log("\n📧 Login credentials:");
  console.log("   Admin - Email: admin@thebate.com, Password: password123");
  console.log("   Users - Any user email above, Password: password123");
  console.log("\n🌍 Topics in multiple languages:");
  console.log("   - Portuguese (PT)");
  console.log("   - English (EN)");
  console.log("   - Spanish (ES)");
  console.log("   - French (FR)");
  console.log("   - German (DE)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
