import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: "admin@thebate.com",
      username: "admin",
      name: "Admin User",
      passwordHash,
      role: "ADMIN",
    },
  });

  const mod = await prisma.user.create({
    data: {
      email: "mod@thebate.com",
      username: "moderator",
      name: "Moderator",
      passwordHash,
      role: "MOD",
    },
  });

  const users = await Promise.all([
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
    prisma.user.create({
      data: {
        email: "ana@example.com",
        username: "ana_costa",
        name: "Ana Costa",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: "pedro@example.com",
        username: "pedro_alves",
        name: "Pedro Alves",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: "sofia@example.com",
        username: "sofia_martins",
        name: "Sofia Martins",
        passwordHash,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length + 2} users`);

  // Create topics
  const topics = [
    {
      slug: "ia-vai-substituir-programadores",
      title: "IA vai substituir programadores?",
      description:
        "Com o avanço de ferramentas como ChatGPT e GitHub Copilot, há um debate crescente sobre o futuro da profissão de programador. Será que a IA vai substituir completamente os desenvolvedores ou apenas vai mudar a forma como trabalhamos?",
      tags: ["tecnologia", "ia", "programação", "futuro"],
    },
    {
      slug: "trabalho-remoto-vs-presencial",
      title: "Trabalho remoto vs presencial: qual o melhor?",
      description:
        "Após a pandemia, muitas empresas adotaram o trabalho remoto. Mas será que é realmente melhor para todos? Discutamos os prós e contras de cada modelo.",
      tags: ["trabalho", "produtividade", "carreira"],
    },
    {
      slug: "framework-javascript-melhor-2024",
      title: "Qual é o melhor framework JavaScript em 2024?",
      description:
        "React, Vue, Angular, Svelte, Solid... São tantas opções! Qual você acha que é o melhor framework JavaScript para começar projetos novos em 2024?",
      tags: ["javascript", "frameworks", "desenvolvimento-web"],
    },
    {
      slug: "criptomoedas-sao-futuro-ou-bolha",
      title: "Criptomoedas são o futuro ou apenas uma bolha?",
      description:
        "Bitcoin, Ethereum e outras criptomoedas prometem revolucionar o sistema financeiro. Mas será que elas realmente são o futuro do dinheiro ou estamos numa bolha especulativa?",
      tags: ["criptomoedas", "finanças", "tecnologia", "blockchain"],
    },
    {
      slug: "mudancas-climaticas-como-agir",
      title: "Mudanças climáticas: o que podemos fazer individualmente?",
      description:
        "As mudanças climáticas são uma realidade. Mas quais ações individuais realmente fazem diferença? Vale a pena mudar hábitos pessoais ou o problema é mais sistêmico?",
      tags: ["clima", "ambiente", "sustentabilidade"],
    },
    {
      slug: "educacao-online-vs-presencial",
      title: "Educação online é tão eficaz quanto presencial?",
      description:
        "Plataformas de ensino online cresceram muito nos últimos anos. Mas será que o aprendizado à distância é tão eficaz quanto o ensino presencial tradicional?",
      tags: ["educação", "online", "aprendizagem"],
    },
    {
      slug: "privacidade-vs-seguranca-digital",
      title: "Até onde devemos abrir mão da privacidade pela segurança?",
      description:
        "Vigilância em massa, reconhecimento facial, dados pessoais... Governos e empresas argumentam que é pela nossa segurança. Mas até que ponto isso é aceitável?",
      tags: ["privacidade", "segurança", "direitos-digitais"],
    },
    {
      slug: "dieta-vegetariana-e-mais-saudavel",
      title: "Dieta vegetariana é realmente mais saudável?",
      description:
        "Há quem defenda que uma dieta sem carne é mais saudável e sustentável. Outros argumentam que precisamos de proteína animal. O que dizem os estudos científicos?",
      tags: ["saúde", "alimentação", "vegetarianismo"],
    },
    {
      slug: "redes-sociais-prejudicam-saude-mental",
      title: "Redes sociais prejudicam nossa saúde mental?",
      description:
        "Estudos mostram correlação entre uso de redes sociais e problemas de saúde mental, especialmente em jovens. Mas será que as redes são a causa ou apenas um reflexo de outros problemas?",
      tags: ["saúde-mental", "redes-sociais", "tecnologia"],
    },
    {
      slug: "inteligencia-artificial-e-etica",
      title: "Como garantir que a IA seja desenvolvida de forma ética?",
      description:
        "A IA está avançando rapidamente, mas questões éticas como viés algorítmico, uso militar e impacto no emprego são preocupantes. Como podemos garantir um desenvolvimento responsável?",
      tags: ["ia", "ética", "tecnologia", "sociedade"],
    },
  ];

  const createdTopics = await Promise.all(
    topics.map((topic, index) =>
      prisma.topic.create({
        data: {
          ...topic,
          createdById: index % 2 === 0 ? admin.id : users[index % users.length].id,
        },
      })
    )
  );

  console.log(`✅ Created ${createdTopics.length} topics`);

  // Create comments
  const commentTexts = [
    "Concordo completamente! Este é um ponto muito importante a ser considerado.",
    "Não tenho certeza sobre isso. Você pode elaborar mais?",
    "Discordo respeitosamente. Na minha experiência, a situação é diferente.",
    "Excelente ponto! Nunca tinha pensado por esse ângulo.",
    "Acho que você está simplificando demais. A questão é mais complexa.",
    "Muito bem explicado! Obrigado por compartilhar.",
    "Isso me lembra de um caso similar que aconteceu...",
    "Tenho dados que contradizem essa afirmação. Posso compartilhar?",
    "Interessante perspectiva, mas e quanto a...?",
    "Perfeito! É exatamente isso que eu penso sobre o assunto.",
  ];

  let commentCount = 0;
  for (const topic of createdTopics) {
    // Create 4-6 comments per topic
    const numComments = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numComments; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const content = commentTexts[Math.floor(Math.random() * commentTexts.length)];
      
      const comment = await prisma.comment.create({
        data: {
          content,
          topicId: topic.id,
          userId: randomUser.id,
          score: Math.floor(Math.random() * 20) - 5, // Random score between -5 and 15
        },
      });

      // Create 1-2 replies for some comments
      if (Math.random() > 0.5) {
        const numReplies = 1 + Math.floor(Math.random() * 2);
        for (let j = 0; j < numReplies; j++) {
          const replyUser = users[Math.floor(Math.random() * users.length)];
          await prisma.comment.create({
            data: {
              content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
              topicId: topic.id,
              userId: replyUser.id,
              parentId: comment.id,
              score: Math.floor(Math.random() * 10) - 2,
            },
          });
          commentCount++;
        }
      }
      commentCount++;
    }
  }

  console.log(`✅ Created ${commentCount} comments (including replies)`);

  console.log("\n🎉 Seeding completed!");
  console.log("\n📧 Login credentials:");
  console.log("   Admin - Email: admin@thebate.com, Password: password123");
  console.log("   Moderator - Email: mod@thebate.com, Password: password123");
  console.log("   Users - Email: maria@example.com, Password: password123");
  console.log("          Email: joao@example.com, Password: password123");
  console.log("          ... and more users");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
