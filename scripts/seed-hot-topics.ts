import { PrismaClient } from "@prisma/client";
import { generateSlug } from "../lib/slug";

const prisma = new PrismaClient();

const topics = [
  // Portuguese (European) - Temas atuais em Portugal
  {
    language: "pt",
    title: "A inteligência artificial deve substituir professores nas escolas?",
    description:
      "Com o avanço da IA generativa como ChatGPT e Claude, surge o debate sobre o papel dos professores. Devemos manter o ensino tradicional ou abraçar a tecnologia como substituta? Qual o impacto no desenvolvimento social e emocional dos alunos?",
    tags: ["educação", "inteligência-artificial", "tecnologia", "futuro"],
  },
  {
    language: "pt",
    title: "Portugal deve investir mais em energia nuclear?",
    description:
      "Enquanto a Europa debate a transição energética, Portugal mantém-se dependente de energias renováveis. A energia nuclear é uma solução viável para garantir independência energética? Quais os riscos e benefícios para o país?",
    tags: ["energia", "ambiente", "política", "economia"],
  },
  {
    language: "pt",
    title: "O teletrabalho deve ser um direito laboral obrigatório?",
    description:
      "Pós-pandemia, muitas empresas exigem o regresso ao escritório. Deve existir legislação que garanta o direito ao trabalho remoto? Como equilibrar produtividade, saúde mental e necessidades empresariais?",
    tags: ["trabalho", "direitos", "sociedade", "produtividade"],
  },
  {
    language: "pt",
    title: "As redes sociais devem ser proibidas para menores de 16 anos?",
    description:
      "Vários países debatem a idade mínima para acesso a redes sociais. Os impactos na saúde mental dos jovens justificam uma proibição? Como proteger crianças sem limitar liberdades?",
    tags: ["redes-sociais", "juventude", "saúde-mental", "tecnologia"],
  },

  // English - Hot topics in English-speaking countries
  {
    language: "en",
    title: "Should artificial intelligence be regulated like nuclear weapons?",
    description:
      "As AI capabilities advance rapidly, experts warn of existential risks. Should governments treat advanced AI systems with the same regulatory framework as nuclear weapons? What are the implications for innovation and safety?",
    tags: ["artificial-intelligence", "regulation", "safety", "technology"],
  },
  {
    language: "en",
    title: "Is cryptocurrency the future of money or a speculative bubble?",
    description:
      "With Bitcoin reaching new highs and major institutions adopting crypto, the debate intensifies. Are cryptocurrencies revolutionizing finance or creating a dangerous bubble? What role should governments play?",
    tags: ["cryptocurrency", "finance", "economy", "blockchain"],
  },
  {
    language: "en",
    title:
      "Should social media companies be liable for content posted by users?",
    description:
      "As misinformation spreads rapidly online, calls grow for platform accountability. Should companies face legal consequences for user-generated content? How do we balance free speech with safety?",
    tags: ["social-media", "law", "free-speech", "technology"],
  },
  {
    language: "en",
    title: "Is remote work destroying company culture and innovation?",
    description:
      "Major tech companies are mandating return-to-office policies, citing culture concerns. Does remote work truly harm collaboration and creativity? Or is this about control and real estate investments?",
    tags: ["remote-work", "workplace", "culture", "productivity"],
  },

  // Spanish - Temas actuales en España y Latinoamérica
  {
    language: "es",
    title: "¿Debe ser la semana laboral de 4 días el nuevo estándar?",
    description:
      "Varios países experimentan con jornadas laborales reducidas con resultados prometedores. ¿Es sostenible implementar esto globalmente? ¿Cómo afectaría a la economía y calidad de vida?",
    tags: ["trabajo", "economía", "calidad-de-vida", "innovación"],
  },
  {
    language: "es",
    title: "¿La inteligencia artificial amenaza más empleos de los que creará?",
    description:
      "Con la automatización acelerándose, crece el temor al desempleo masivo. ¿Debemos temer o abrazar esta transición? ¿Qué sectores están en mayor riesgo?",
    tags: ["inteligencia-artificial", "empleo", "futuro", "tecnología"],
  },
  {
    language: "es",
    title: "¿Debería ser obligatorio el voto electrónico en las elecciones?",
    description:
      "La tecnología podría aumentar participación electoral, pero surgen dudas sobre seguridad. ¿Es el voto electrónico el futuro de la democracia o una amenaza a la integridad electoral?",
    tags: ["democracia", "tecnología", "política", "seguridad"],
  },
  {
    language: "es",
    title: "¿Los videojuegos causan violencia en los jóvenes?",
    description:
      "El debate persiste sobre el impacto de videojuegos violentos. ¿Existe evidencia científica de efectos negativos? ¿O es un problema de educación y supervisión parental?",
    tags: ["videojuegos", "juventud", "sociedad", "educación"],
  },

  // French - Sujets d'actualité en France
  {
    language: "fr",
    title: "La France devrait-elle sortir du nucléaire civil?",
    description:
      "Alors que l'Allemagne ferme ses centrales, la France reste nucléaire. Face au changement climatique, est-ce la bonne stratégie? Quels sont les risques et avantages à long terme?",
    tags: ["énergie", "environnement", "politique", "nucléaire"],
  },
  {
    language: "fr",
    title: "Les algorithmes de réseaux sociaux menacent-ils la démocratie?",
    description:
      "Les bulles de filtres et la polarisation inquiètent. Les algorithmes manipulent-ils l'opinion publique? Faut-il réglementer plus strictement les plateformes?",
    tags: ["réseaux-sociaux", "démocratie", "technologie", "société"],
  },
  {
    language: "fr",
    title: "Le revenu universel de base est-il une solution viable?",
    description:
      "Face à l'automatisation et aux inégalités, le revenu universel refait débat. Est-ce économiquement viable? Encouragerait-il l'oisiveté ou libérerait-il le potentiel humain?",
    tags: ["économie", "société", "innovation", "travail"],
  },
  {
    language: "fr",
    title: "Les voitures électriques sont-elles vraiment écologiques?",
    description:
      "L'extraction de lithium et la production électrique polluent aussi. Les véhicules électriques sont-ils la solution verte promise? Ou simplement déplaçons-nous le problème?",
    tags: ["environnement", "transport", "technologie", "écologie"],
  },

  // German - Aktuelle Themen in Deutschland
  {
    language: "de",
    title: "Sollte Deutschland ein Tempolimit auf Autobahnen einführen?",
    description:
      "Die Debatte spaltet das Land. Klimaschutz vs. Freiheit - was wiegt schwerer? Welche Auswirkungen hätte ein Tempolimit auf Umwelt und Wirtschaft?",
    tags: ["verkehr", "umwelt", "politik", "gesellschaft"],
  },
  {
    language: "de",
    title: "Ist die 4-Tage-Woche die Zukunft der Arbeit?",
    description:
      "Pilotprojekte zeigen positive Ergebnisse. Kann Deutschland sich das leisten? Wie würde es Produktivität und Lebensqualität beeinflussen?",
    tags: ["arbeit", "wirtschaft", "lebensqualität", "innovation"],
  },
  {
    language: "de",
    title: "Sollten KI-generierte Inhalte gekennzeichnet werden müssen?",
    description:
      "Mit ChatGPT und Stable Diffusion wird die Grenze verwischt. Brauchen wir Transparenzgesetze für KI-Content? Wie schützen wir uns vor Desinformation?",
    tags: ["künstliche-intelligenz", "medien", "technologie", "recht"],
  },
  {
    language: "de",
    title: "Ist Bargeld noch zeitgemäß oder sollte es abgeschafft werden?",
    description:
      "Skandinavien geht voran bei bargeldloser Gesellschaft. Sollte Deutschland folgen? Was bedeutet das für Privatsphäre, Freiheit und finanzielle Inklusion?",
    tags: ["finanzen", "technologie", "privatsphäre", "gesellschaft"],
  },
];

async function main() {
  try {
    // Get user by username or email
    const identifier = process.argv[2] || "admin"; // Use first command line argument or default to 'admin'

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
      select: { id: true, username: true, email: true },
    });

    if (!user) {
      console.error(`❌ User '${identifier}' not found!`);
      console.log("\n📋 Available users:");
      const allUsers = await prisma.user.findMany({
        select: { username: true, email: true },
      });
      allUsers.forEach((u) => console.log(`   - ${u.username} (${u.email})`));
      console.log("\nUsage: pnpm db:seed-topics [username or email]");
      console.log("Example: pnpm db:seed-topics admin");
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.username} (${user.email})`);
    console.log(`📝 Creating ${topics.length} hot topics...\n`);

    let created = 0;
    let skipped = 0;

    for (const topic of topics) {
      const slug = generateSlug(topic.title);

      // Check if topic already exists
      const existing = await prisma.topic.findUnique({
        where: { slug },
      });

      if (existing) {
        console.log(`⏭️  Skipped (already exists): ${topic.title}`);
        skipped++;
        continue;
      }

      await prisma.topic.create({
        data: {
          title: topic.title,
          slug,
          description: topic.description,
          language: topic.language,
          tags: topic.tags,
          status: "ACTIVE",
          createdById: user.id,
        },
      });

      console.log(
        `✅ Created [${topic.language.toUpperCase()}]: ${topic.title}`
      );
      created++;
    }

    console.log(`\n🎉 Summary:`);
    console.log(`   ✅ ${created} topics created`);
    console.log(`   ⏭️  ${skipped} topics skipped (already exist)`);
    console.log(`   📊 Total: ${topics.length} topics processed`);
  } catch (error) {
    console.error("❌ Error creating topics:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
