import { prisma } from "../lib/prisma";
import { generateSlug } from "../lib/slug";

async function main() {
  // Buscar o primeiro user (ou o user específico)
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!user) {
    throw new Error("Nenhum user encontrado! Cria um user primeiro.");
  }

  console.log(`\n🎯 A criar tópicos para: ${user.username} (${user.email})`);
  console.log(`   User ID: ${user.id}\n`);

  const topics = [
    // Portuguese (pt)
    {
      title: "IA vai substituir programadores?",
      description:
        "Com o avanço da inteligência artificial, será que os programadores serão substituídos ou terão de se adaptar?",
      language: "pt" as const,
    },
    {
      title: "Trabalho remoto vs presencial: qual o melhor?",
      description:
        "Depois da pandemia, empresas estão a exigir volta ao escritório. Vale a pena?",
      language: "pt" as const,
    },
    {
      title: "Qual é o melhor framework JavaScript em 2024?",
      description:
        "React, Vue, Angular, Svelte, ou Solid? Qual escolhes para o teu próximo projeto?",
      language: "pt" as const,
    },
    {
      title: "Criptomoedas são o futuro ou apenas uma bolha?",
      description:
        "Bitcoin, Ethereum e outras criptomoedas continuam a dividir opiniões. Qual a tua?",
      language: "pt" as const,
    },
    {
      title: "Mudanças climáticas: o que podemos fazer individualmente?",
      description:
        "Ações pessoais fazem diferença ou só políticas públicas resolvem o problema?",
      language: "pt" as const,
    },
    {
      title: "Educação online é tão eficaz quanto presencial?",
      description:
        "Com plataformas como Coursera e Udemy, ainda vale a pena a educação tradicional?",
      language: "pt" as const,
    },
    {
      title: "Até onde devemos abrir mão da privacidade pela segurança?",
      description:
        "Câmaras de vigilância, reconhecimento facial - onde traçar o limite?",
      language: "pt" as const,
    },
    {
      title: "Dieta vegetariana é realmente mais saudável?",
      description:
        "Argumentos científicos a favor e contra. O que dizem os estudos?",
      language: "pt" as const,
    },
    {
      title: "Redes sociais prejudicam nossa saúde mental?",
      description:
        "Instagram, TikTok, Twitter - estamos a perder controlo sobre o nosso bem-estar?",
      language: "pt" as const,
    },
    {
      title: "Como garantir que a IA seja desenvolvida de forma ética?",
      description:
        "Vieses algorítmicos, deep fakes e vigilância - como regular a IA?",
      language: "pt" as const,
    },
    // English (en)
    {
      title: "Will AI replace programmers?",
      description:
        "With the advancement of artificial intelligence, will programmers be replaced or will they have to adapt?",
      language: "en" as const,
    },
    {
      title: "Remote work vs office: which is better?",
      description:
        "After the pandemic, companies are demanding return to office. Is it worth it?",
      language: "en" as const,
    },
    {
      title: "What's the best JavaScript framework in 2024?",
      description:
        "React, Vue, Angular, Svelte, or Solid? Which do you choose for your next project?",
      language: "en" as const,
    },
    {
      title: "Are cryptocurrencies the future or just a bubble?",
      description:
        "Bitcoin, Ethereum and other cryptocurrencies continue to divide opinions. What's yours?",
      language: "en" as const,
    },
    {
      title: "Climate change: what can we do individually?",
      description:
        "Do personal actions make a difference or only public policies solve the problem?",
      language: "en" as const,
    },
    {
      title: "Is online education as effective as in-person?",
      description:
        "With platforms like Coursera and Udemy, is traditional education still worth it?",
      language: "en" as const,
    },
    {
      title: "How far should we give up privacy for security?",
      description:
        "Surveillance cameras, facial recognition - where to draw the line?",
      language: "en" as const,
    },
    {
      title: "Is a vegetarian diet really healthier?",
      description:
        "Scientific arguments for and against. What do the studies say?",
      language: "en" as const,
    },
    {
      title: "Do social media harm our mental health?",
      description:
        "Instagram, TikTok, Twitter - are we losing control over our well-being?",
      language: "en" as const,
    },
    {
      title: "How to ensure AI is developed ethically?",
      description:
        "Algorithmic biases, deep fakes and surveillance - how to regulate AI?",
      language: "en" as const,
    },
    // Spanish (es)
    {
      title: "¿La IA reemplazará a los programadores?",
      description:
        "Con el avance de la inteligencia artificial, ¿serán reemplazados los programadores o tendrán que adaptarse?",
      language: "es" as const,
    },
    {
      title: "Trabajo remoto vs presencial: ¿cuál es mejor?",
      description:
        "Después de la pandemia, las empresas exigen volver a la oficina. ¿Vale la pena?",
      language: "es" as const,
    },
    {
      title: "¿Cuál es el mejor framework JavaScript en 2024?",
      description:
        "React, Vue, Angular, Svelte o Solid? ¿Cuál eliges para tu próximo proyecto?",
      language: "es" as const,
    },
    {
      title: "¿Las criptomonedas son el futuro o solo una burbuja?",
      description:
        "Bitcoin, Ethereum y otras criptomonedas siguen dividiendo opiniones. ¿Cuál es la tuya?",
      language: "es" as const,
    },
    {
      title: "Cambio climático: ¿qué podemos hacer individualmente?",
      description:
        "¿Las acciones personales hacen la diferencia o solo las políticas públicas resuelven el problema?",
      language: "es" as const,
    },
    {
      title: "¿La educación online es tan efectiva como la presencial?",
      description:
        "Con plataformas como Coursera y Udemy, ¿todavía vale la pena la educación tradicional?",
      language: "es" as const,
    },
    {
      title: "¿Hasta dónde debemos renunciar a la privacidad por seguridad?",
      description:
        "Cámaras de vigilancia, reconocimiento facial - ¿dónde trazar el límite?",
      language: "es" as const,
    },
    {
      title: "¿La dieta vegetariana es realmente más saludable?",
      description:
        "Argumentos científicos a favor y en contra. ¿Qué dicen los estudios?",
      language: "es" as const,
    },
    {
      title: "¿Las redes sociales perjudican nuestra salud mental?",
      description:
        "Instagram, TikTok, Twitter - ¿estamos perdiendo el control sobre nuestro bienestar?",
      language: "es" as const,
    },
    {
      title: "¿Cómo garantizar que la IA se desarrolle éticamente?",
      description:
        "Sesgos algorítmicos, deep fakes y vigilancia - ¿cómo regular la IA?",
      language: "es" as const,
    },
    // French (fr)
    {
      title: "L'IA va-t-elle remplacer les programmeurs?",
      description:
        "Avec l'avancement de l'intelligence artificielle, les programmeurs seront-ils remplacés ou devront-ils s'adapter?",
      language: "fr" as const,
    },
    {
      title: "Télétravail vs bureau: lequel est le meilleur?",
      description:
        "Après la pandémie, les entreprises exigent le retour au bureau. Est-ce que ça vaut le coup?",
      language: "fr" as const,
    },
    {
      title: "Quel est le meilleur framework JavaScript en 2024?",
      description:
        "React, Vue, Angular, Svelte ou Solid? Lequel choisissez-vous pour votre prochain projet?",
      language: "fr" as const,
    },
    {
      title: "Les cryptomonnaies sont-elles l'avenir ou juste une bulle?",
      description:
        "Bitcoin, Ethereum et autres cryptomonnaies continuent de diviser les opinions. Quelle est la vôtre?",
      language: "fr" as const,
    },
    {
      title: "Changement climatique: que pouvons-nous faire individuellement?",
      description:
        "Les actions personnelles font-elles la différence ou seules les politiques publiques résolvent le problème?",
      language: "fr" as const,
    },
    {
      title: "L'éducation en ligne est-elle aussi efficace qu'en personne?",
      description:
        "Avec des plateformes comme Coursera et Udemy, l'éducation traditionnelle vaut-elle toujours le coup?",
      language: "fr" as const,
    },
    {
      title: "Jusqu'où devons-nous renoncer à la vie privée pour la sécurité?",
      description:
        "Caméras de surveillance, reconnaissance faciale - où tracer la limite?",
      language: "fr" as const,
    },
    {
      title: "Le régime végétarien est-il vraiment plus sain?",
      description:
        "Arguments scientifiques pour et contre. Que disent les études?",
      language: "fr" as const,
    },
    {
      title: "Les réseaux sociaux nuisent-ils à notre santé mentale?",
      description:
        "Instagram, TikTok, Twitter - perdons-nous le contrôle sur notre bien-être?",
      language: "fr" as const,
    },
    {
      title: "Comment garantir que l'IA soit développée de manière éthique?",
      description:
        "Biais algorithmiques, deep fakes et surveillance - comment réguler l'IA?",
      language: "fr" as const,
    },
    // German (de)
    {
      title: "Wird KI Programmierer ersetzen?",
      description:
        "Mit dem Fortschritt der künstlichen Intelligenz, werden Programmierer ersetzt oder müssen sie sich anpassen?",
      language: "de" as const,
    },
    {
      title: "Remote-Arbeit vs Büro: Was ist besser?",
      description:
        "Nach der Pandemie fordern Unternehmen die Rückkehr ins Büro. Lohnt es sich?",
      language: "de" as const,
    },
    {
      title: "Was ist das beste JavaScript-Framework in 2024?",
      description:
        "React, Vue, Angular, Svelte oder Solid? Welches wählst du für dein nächstes Projekt?",
      language: "de" as const,
    },
    {
      title: "Sind Kryptowährungen die Zukunft oder nur eine Blase?",
      description:
        "Bitcoin, Ethereum und andere Kryptowährungen spalten weiterhin die Meinungen. Was ist deine?",
      language: "de" as const,
    },
    {
      title: "Klimawandel: Was können wir individuell tun?",
      description:
        "Machen persönliche Aktionen einen Unterschied oder lösen nur öffentliche Richtlinien das Problem?",
      language: "de" as const,
    },
    {
      title: "Ist Online-Bildung genauso effektiv wie Präsenzunterricht?",
      description:
        "Mit Plattformen wie Coursera und Udemy, lohnt sich traditionelle Bildung noch?",
      language: "de" as const,
    },
    {
      title: "Wie weit sollten wir Privatsphäre für Sicherheit aufgeben?",
      description:
        "Überwachungskameras, Gesichtserkennung - wo die Grenze ziehen?",
      language: "de" as const,
    },
    {
      title: "Ist eine vegetarische Ernährung wirklich gesünder?",
      description:
        "Wissenschaftliche Argumente dafür und dagegen. Was sagen die Studien?",
      language: "de" as const,
    },
    {
      title: "Schaden soziale Medien unserer mentalen Gesundheit?",
      description:
        "Instagram, TikTok, Twitter - verlieren wir die Kontrolle über unser Wohlbefinden?",
      language: "de" as const,
    },
    {
      title: "Wie kann sichergestellt werden, dass KI ethisch entwickelt wird?",
      description:
        "Algorithmische Verzerrungen, Deep Fakes und Überwachung - wie KI regulieren?",
      language: "de" as const,
    },
  ];

  console.log(`📝 A criar ${topics.length} tópicos...\n`);

  let created = 0;
  const errors: Array<{ title: string; error: string }> = [];

  for (const topic of topics) {
    try {
      const slug = generateSlug(topic.title);
      await prisma.topic.create({
        data: {
          title: topic.title,
          description: topic.description,
          language: topic.language,
          slug,
          status: "ACTIVE",
          createdById: user.id,
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

  // Contagem por idioma
  const counts = await prisma.topic.groupBy({
    by: ["language"],
    _count: true,
  });

  console.log(`\n📊 Tópicos por idioma:`);
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
