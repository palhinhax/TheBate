import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Multilingual topics data
const multilingualTopics = [
  // Portuguese
  {
    slug: "ia-vai-substituir-programadores",
    title: "IA vai substituir programadores?",
    description:
      "Com o avanço de ferramentas como ChatGPT e GitHub Copilot, há uma discussão crescente sobre o futuro da profissão de programador.",
    tags: ["tecnologia", "ia", "programação"],
    language: "pt",
  },
  {
    slug: "trabalho-remoto-futuro",
    title: "O futuro do trabalho remoto",
    description:
      "Após a pandemia, muitas empresas adotaram o trabalho remoto. Será este o futuro do trabalho?",
    tags: ["trabalho", "remoto", "tecnologia"],
    language: "pt",
  },
  {
    slug: "privacidade-vs-seguranca-digital",
    title: "Privacidade vs Segurança Digital",
    description:
      "Devemos sacrificar privacidade em nome da segurança online? Um debate sobre direitos digitais.",
    tags: ["privacidade", "segurança", "direitos"],
    language: "pt",
  },
  
  // English
  {
    slug: "will-ai-replace-software-developers",
    title: "Will AI Replace Software Developers?",
    description:
      "With the advancement of tools like ChatGPT and GitHub Copilot, there's a growing discussion about the future of the programming profession.",
    tags: ["technology", "ai", "programming"],
    language: "en",
  },
  {
    slug: "remote-work-revolution",
    title: "The Remote Work Revolution",
    description:
      "After the pandemic, many companies adopted remote work. Is this the future of work?",
    tags: ["work", "remote", "technology"],
    language: "en",
  },
  {
    slug: "cryptocurrency-future-of-money",
    title: "Is Cryptocurrency the Future of Money?",
    description:
      "Bitcoin, Ethereum, and other cryptocurrencies are changing how we think about money. But are they really the future?",
    tags: ["crypto", "blockchain", "finance"],
    language: "en",
  },
  {
    slug: "climate-change-technology-solutions",
    title: "Can Technology Solve Climate Change?",
    description:
      "From renewable energy to carbon capture, technology offers many solutions to climate change. But is it enough?",
    tags: ["climate", "technology", "environment"],
    language: "en",
  },
  
  // Spanish
  {
    slug: "ia-reemplazara-desarrolladores",
    title: "¿La IA reemplazará a los desarrolladores?",
    description:
      "Con el avance de herramientas como ChatGPT y GitHub Copilot, hay una discusión creciente sobre el futuro de la profesión de programador.",
    tags: ["tecnología", "ia", "programación"],
    language: "es",
  },
  {
    slug: "trabajo-remoto-futuro",
    title: "El futuro del trabajo remoto",
    description:
      "Después de la pandemia, muchas empresas adoptaron el trabajo remoto. ¿Es este el futuro del trabajo?",
    tags: ["trabajo", "remoto", "tecnología"],
    language: "es",
  },
  {
    slug: "energia-renovable-futuro",
    title: "Energía Renovable: ¿El Futuro Sostenible?",
    description:
      "Solar, eólica y otras fuentes renovables están cambiando el panorama energético. ¿Son la solución al cambio climático?",
    tags: ["energía", "sostenibilidad", "medio ambiente"],
    language: "es",
  },
  
  // French
  {
    slug: "ia-remplacera-developpeurs",
    title: "L'IA remplacera-t-elle les développeurs ?",
    description:
      "Avec l'avancement d'outils comme ChatGPT et GitHub Copilot, il y a une discussion croissante sur l'avenir de la profession de programmeur.",
    tags: ["technologie", "ia", "programmation"],
    language: "fr",
  },
  {
    slug: "travail-distance-revolution",
    title: "La révolution du travail à distance",
    description:
      "Après la pandémie, de nombreuses entreprises ont adopté le travail à distance. Est-ce l'avenir du travail?",
    tags: ["travail", "distance", "technologie"],
    language: "fr",
  },
  {
    slug: "intelligence-artificielle-ethique",
    title: "L'éthique de l'intelligence artificielle",
    description:
      "L'IA soulève de nombreuses questions éthiques. Comment garantir que l'IA soit développée de manière responsable?",
    tags: ["ia", "éthique", "société"],
    language: "fr",
  },
  
  // German
  {
    slug: "wird-ki-entwickler-ersetzen",
    title: "Wird KI Entwickler ersetzen?",
    description:
      "Mit dem Fortschritt von Tools wie ChatGPT und GitHub Copilot gibt es eine wachsende Diskussion über die Zukunft des Programmierberufs.",
    tags: ["technologie", "ki", "programmierung"],
    language: "de",
  },
  {
    slug: "homeoffice-zukunft-arbeit",
    title: "Homeoffice: Die Zukunft der Arbeit?",
    description:
      "Nach der Pandemie haben viele Unternehmen Homeoffice eingeführt. Ist dies die Zukunft der Arbeit?",
    tags: ["arbeit", "homeoffice", "technologie"],
    language: "de",
  },
  {
    slug: "digitale-privatsphare-grundrecht",
    title: "Digitale Privatsphäre als Grundrecht",
    description:
      "In einer zunehmend digitalen Welt wird der Schutz der Privatsphäre immer wichtiger. Sollte sie ein Grundrecht sein?",
    tags: ["privatsphäre", "datenschutz", "rechte"],
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
          score: Math.floor(Math.random() * 20) - 5,
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
