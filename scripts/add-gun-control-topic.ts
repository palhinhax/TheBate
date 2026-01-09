import { prisma } from "../lib/prisma";
import { generateSlug } from "../lib/slug";
import crypto from "crypto";

function generateCuid() {
  // Simple cuid-like generation
  const timestamp = Date.now().toString(36);
  const randomPart = crypto.randomBytes(12).toString("base64").replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 12);
  return `c${timestamp}${randomPart}`;
}

async function main() {
  // Buscar o primeiro user
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!user) {
    throw new Error("Nenhum user encontrado!");
  }

  console.log(`\n🎯 A criar tópico polêmico sobre controle de armas para: ${user.username}`);
  console.log(`   User ID: ${user.id}\n`);

  const topics = [
    // English - Super controversial gun control topic
    {
      title: "Should the Second Amendment be repealed? Guns kill more Americans than save them",
      description:
        "The data is clear: more guns = more deaths. Mass shootings happen weekly. Children die in schools. Yet gun lobbyists claim 'good guys with guns' are the solution. Is the right to bear arms worth thousands of lives every year, or is it time to admit the Second Amendment is outdated and deadly?",
      language: "en" as const,
    },
    // Portuguese
    {
      title: "EUA: o direito às armas vale mais que a vida das crianças?",
      description:
        "Tiroteios em escolas, massacres semanais, milhares de mortes por ano. Os dados são claros: mais armas = mais mortes. Mas os americanos continuam a defender a Segunda Emenda como sagrada. Será que o 'direito de portar armas' justifica ver crianças morrerem em escolas?",
      language: "pt" as const,
    },
    // Spanish
    {
      title: "¿EEUU: el derecho a las armas vale más que la vida de los niños?",
      description:
        "Tiroteos en escuelas, masacres semanales, miles de muertes al año. Los datos son claros: más armas = más muertes. Pero los estadounidenses siguen defendiendo la Segunda Enmienda como sagrada. ¿El 'derecho a portar armas' justifica ver niños morir en las escuelas?",
      language: "es" as const,
    },
    // French
    {
      title: "USA: le droit aux armes vaut-il plus que la vie des enfants?",
      description:
        "Fusillades dans les écoles, massacres hebdomadaires, des milliers de morts par an. Les données sont claires: plus d'armes = plus de morts. Mais les Américains continuent de défendre le Deuxième Amendement comme sacré. Le 'droit de porter des armes' justifie-t-il de voir des enfants mourir dans les écoles?",
      language: "fr" as const,
    },
    // German
    {
      title: "USA: Ist das Waffenrecht mehr wert als Kinderleben?",
      description:
        "Schießereien in Schulen, wöchentliche Massaker, Tausende Tote pro Jahr. Die Daten sind klar: mehr Waffen = mehr Tote. Aber Amerikaner verteidigen weiterhin das Zweite Amendment als heilig. Rechtfertigt das 'Recht auf Waffen' das Sterben von Kindern in Schulen?",
      language: "de" as const,
    },
    // Hindi
    {
      title: "अमेरिका: क्या हथियारों का अधिकार बच्चों की जान से ज़्यादा महत्वपूर्ण है?",
      description:
        "स्कूलों में गोलीबारी, साप्ताहिक नरसंहार, हर साल हजारों मौतें। डेटा स्पष्ट है: अधिक हथियार = अधिक मौतें। लेकिन अमेरिकी दूसरे संशोधन को पवित्र मानते हैं। क्या 'हथियार रखने का अधिकार' स्कूलों में बच्चों की मौत को उचित ठहराता है?",
      language: "hi" as const,
    },
    // Chinese
    {
      title: "美国：持枪权比儿童生命更重要吗？",
      description:
        "学校枪击、每周大屠杀、每年数千人死亡。数据很明确：更多枪支=更多死亡。但美国人继续把第二修正案视为神圣。'持枪权'是否能证明看着孩子在学校死去是合理的？",
      language: "zh" as const,
    },
  ];

  console.log(`📝 A criar ${topics.length} tópicos sobre controle de armas...\n`);

  let created = 0;
  const errors: Array<{ title: string; error: string }> = [];

  for (const topic of topics) {
    try {
      const slug = generateSlug(topic.title);
      
      // Check if topic already exists
      const existing = await prisma.topic.findUnique({
        where: { slug },
      });

      if (existing) {
        console.log(`⏭️  [${topic.language}] Já existe: ${topic.title}`);
        continue;
      }

      await prisma.topic.create({
        data: {
          id: generateCuid(),
          title: topic.title,
          description: topic.description,
          language: topic.language,
          slug,
          status: "ACTIVE",
          createdById: user.id,
          updatedAt: new Date(),
        },
      });
      created++;
      console.log(`✅ [${topic.language}] ${topic.title}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      errors.push({ title: topic.title, error: errorMessage });
      console.log(`❌ [${topic.language}] ${topic.title} - ${errorMessage}`);
    }
  }

  console.log(`\n✨ Resumo:`);
  console.log(`   ✅ Criados: ${created}`);
  console.log(`   ❌ Erros: ${errors.length}`);

  if (errors.length > 0) {
    console.log(`\n⚠️  Erros encontrados:`);
    errors.forEach((e) => {
      console.log(`   - ${e.title}: ${e.error}`);
    });
  }

  // Contagem total por idioma
  const counts = await prisma.topic.groupBy({
    by: ["language"],
    _count: true,
  });

  console.log(`\n📊 Total de tópicos por idioma:`);
  counts.forEach((c) => {
    console.log(`   ${c.language}: ${c._count}`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Erro fatal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
