import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface TopicData {
  title: string;
  description: string;
  tags: string[];
  language: string;
  slug: string;
}

// Temas em Português (pt)
const topicsPt: TopicData[] = [
  {
    slug: "ia-vai-substituir-programadores-pt",
    title: "IA vai substituir programadores?",
    description:
      "Com o avanço de ferramentas como ChatGPT e GitHub Copilot, há uma discussão crescente sobre o futuro da profissão de programador. Será que a IA vai substituir completamente os desenvolvedores ou apenas vai mudar a forma como trabalhamos?",
    tags: ["tecnologia", "ia", "programação", "futuro"],
    language: "pt",
  },
  {
    slug: "trabalho-remoto-vs-presencial-pt",
    title: "Trabalho remoto vs presencial: qual o melhor?",
    description:
      "Após a pandemia, muitas empresas adotaram o trabalho remoto. Mas será que é realmente melhor para todos? Discutamos os prós e contras de cada modelo.",
    tags: ["trabalho", "produtividade", "carreira"],
    language: "pt",
  },
  {
    slug: "framework-javascript-melhor-2024-pt",
    title: "Qual é o melhor framework JavaScript em 2024?",
    description:
      "React, Vue, Angular, Svelte, Solid... São tantas opções! Qual você acha que é o melhor framework JavaScript para começar projetos novos em 2024?",
    tags: ["javascript", "frameworks", "desenvolvimento-web"],
    language: "pt",
  },
  {
    slug: "criptomoedas-sao-futuro-ou-bolha-pt",
    title: "Criptomoedas são o futuro ou apenas uma bolha?",
    description:
      "Bitcoin, Ethereum e outras criptomoedas prometem revolucionar o sistema financeiro. Mas será que elas realmente são o futuro do dinheiro ou estamos numa bolha especulativa?",
    tags: ["criptomoedas", "finanças", "tecnologia", "blockchain"],
    language: "pt",
  },
  {
    slug: "mudancas-climaticas-como-agir-pt",
    title: "Mudanças climáticas: o que podemos fazer individualmente?",
    description:
      "As mudanças climáticas são uma realidade. Mas quais ações individuais realmente fazem diferença? Vale a pena mudar hábitos pessoais ou o problema é mais sistêmico?",
    tags: ["clima", "ambiente", "sustentabilidade"],
    language: "pt",
  },
  {
    slug: "educacao-online-vs-presencial-pt",
    title: "Educação online é tão eficaz quanto presencial?",
    description:
      "Plataformas de ensino online cresceram muito nos últimos anos. Mas será que o aprendizado à distância é tão eficaz quanto o ensino presencial tradicional?",
    tags: ["educação", "online", "aprendizagem"],
    language: "pt",
  },
  {
    slug: "privacidade-vs-seguranca-digital-pt",
    title: "Até onde devemos abrir mão da privacidade pela segurança?",
    description:
      "Vigilância em massa, reconhecimento facial, dados pessoais... Governos e empresas argumentam que é pela nossa segurança. Mas até que ponto isso é aceitável?",
    tags: ["privacidade", "segurança", "direitos-digitais"],
    language: "pt",
  },
  {
    slug: "dieta-vegetariana-e-mais-saudavel-pt",
    title: "Dieta vegetariana é realmente mais saudável?",
    description:
      "Há quem defenda que uma dieta sem carne é mais saudável e sustentável. Outros argumentam que precisamos de proteína animal. O que dizem os estudos científicos?",
    tags: ["saúde", "alimentação", "vegetarianismo"],
    language: "pt",
  },
  {
    slug: "redes-sociais-prejudicam-saude-mental-pt",
    title: "Redes sociais prejudicam nossa saúde mental?",
    description:
      "Estudos mostram correlação entre uso de redes sociais e problemas de saúde mental, especialmente em jovens. Mas será que as redes são a causa ou apenas um reflexo de outros problemas?",
    tags: ["saúde-mental", "redes-sociais", "tecnologia"],
    language: "pt",
  },
  {
    slug: "inteligencia-artificial-e-etica-pt",
    title: "Como garantir que a IA seja desenvolvida de forma ética?",
    description:
      "A IA está avançando rapidamente, mas questões éticas como viés algorítmico, uso militar e impacto no emprego são preocupantes. Como podemos garantir um desenvolvimento responsável?",
    tags: ["ia", "ética", "tecnologia", "sociedade"],
    language: "pt",
  },
];

// Temas em Inglês (en)
const topicsEn: TopicData[] = [
  {
    slug: "will-ai-replace-programmers-en",
    title: "Will AI replace programmers?",
    description:
      "With the advancement of tools like ChatGPT and GitHub Copilot, there's a growing discussion about the future of the programming profession. Will AI completely replace developers or just change how we work?",
    tags: ["technology", "ai", "programming", "future"],
    language: "en",
  },
  {
    slug: "remote-vs-office-work-en",
    title: "Remote work vs office: which is better?",
    description:
      "After the pandemic, many companies adopted remote work. But is it really better for everyone? Let's discuss the pros and cons of each model.",
    tags: ["work", "productivity", "career"],
    language: "en",
  },
  {
    slug: "best-javascript-framework-2024-en",
    title: "What is the best JavaScript framework in 2024?",
    description:
      "React, Vue, Angular, Svelte, Solid... So many options! Which do you think is the best JavaScript framework for starting new projects in 2024?",
    tags: ["javascript", "frameworks", "web-development"],
    language: "en",
  },
  {
    slug: "cryptocurrencies-future-or-bubble-en",
    title: "Are cryptocurrencies the future or just a bubble?",
    description:
      "Bitcoin, Ethereum and other cryptocurrencies promise to revolutionize the financial system. But are they really the future of money or are we in a speculative bubble?",
    tags: ["cryptocurrency", "finance", "technology", "blockchain"],
    language: "en",
  },
  {
    slug: "climate-change-individual-action-en",
    title: "Climate change: what can we do individually?",
    description:
      "Climate change is a reality. But which individual actions really make a difference? Is it worth changing personal habits or is the problem more systemic?",
    tags: ["climate", "environment", "sustainability"],
    language: "en",
  },
  {
    slug: "online-vs-classroom-education-en",
    title: "Is online education as effective as classroom learning?",
    description:
      "Online learning platforms have grown a lot in recent years. But is distance learning as effective as traditional classroom teaching?",
    tags: ["education", "online", "learning"],
    language: "en",
  },
  {
    slug: "privacy-vs-security-digital-en",
    title: "How far should we sacrifice privacy for security?",
    description:
      "Mass surveillance, facial recognition, personal data... Governments and companies argue it's for our security. But how far is this acceptable?",
    tags: ["privacy", "security", "digital-rights"],
    language: "en",
  },
  {
    slug: "vegetarian-diet-healthier-en",
    title: "Is a vegetarian diet really healthier?",
    description:
      "Some argue that a meat-free diet is healthier and more sustainable. Others argue we need animal protein. What do scientific studies say?",
    tags: ["health", "nutrition", "vegetarianism"],
    language: "en",
  },
  {
    slug: "social-media-mental-health-en",
    title: "Do social media harm our mental health?",
    description:
      "Studies show correlation between social media use and mental health problems, especially in young people. But are social media the cause or just a reflection of other problems?",
    tags: ["mental-health", "social-media", "technology"],
    language: "en",
  },
  {
    slug: "artificial-intelligence-ethics-en",
    title: "How to ensure AI is developed ethically?",
    description:
      "AI is advancing rapidly, but ethical issues like algorithmic bias, military use and employment impact are concerning. How can we ensure responsible development?",
    tags: ["ai", "ethics", "technology", "society"],
    language: "en",
  },
];

// Temas em Espanhol (es)
const topicsEs: TopicData[] = [
  {
    slug: "ia-reemplazara-programadores-es",
    title: "¿La IA reemplazará a los programadores?",
    description:
      "Con el avance de herramientas como ChatGPT y GitHub Copilot, hay una discusión creciente sobre el futuro de la profesión de programador. ¿La IA reemplazará completamente a los desarrolladores o solo cambiará la forma en que trabajamos?",
    tags: ["tecnología", "ia", "programación", "futuro"],
    language: "es",
  },
  {
    slug: "trabajo-remoto-vs-presencial-es",
    title: "Trabajo remoto vs presencial: ¿cuál es mejor?",
    description:
      "Después de la pandemia, muchas empresas adoptaron el trabajo remoto. ¿Pero es realmente mejor para todos? Discutamos los pros y contras de cada modelo.",
    tags: ["trabajo", "productividad", "carrera"],
    language: "es",
  },
  {
    slug: "mejor-framework-javascript-2024-es",
    title: "¿Cuál es el mejor framework JavaScript en 2024?",
    description:
      "React, Vue, Angular, Svelte, Solid... ¡Tantas opciones! ¿Cuál crees que es el mejor framework JavaScript para comenzar nuevos proyectos en 2024?",
    tags: ["javascript", "frameworks", "desarrollo-web"],
    language: "es",
  },
  {
    slug: "criptomonedas-futuro-o-burbuja-es",
    title: "¿Las criptomonedas son el futuro o solo una burbuja?",
    description:
      "Bitcoin, Ethereum y otras criptomonedas prometen revolucionar el sistema financiero. ¿Pero son realmente el futuro del dinero o estamos en una burbuja especulativa?",
    tags: ["criptomonedas", "finanzas", "tecnología", "blockchain"],
    language: "es",
  },
  {
    slug: "cambio-climatico-accion-individual-es",
    title: "Cambio climático: ¿qué podemos hacer individualmente?",
    description:
      "El cambio climático es una realidad. ¿Pero qué acciones individuales realmente hacen la diferencia? ¿Vale la pena cambiar hábitos personales o el problema es más sistémico?",
    tags: ["clima", "ambiente", "sostenibilidad"],
    language: "es",
  },
  {
    slug: "educacion-online-vs-presencial-es",
    title: "¿La educación online es tan efectiva como la presencial?",
    description:
      "Las plataformas de enseñanza online han crecido mucho en los últimos años. ¿Pero es el aprendizaje a distancia tan efectivo como la enseñanza presencial tradicional?",
    tags: ["educación", "online", "aprendizaje"],
    language: "es",
  },
  {
    slug: "privacidad-vs-seguridad-digital-es",
    title: "¿Hasta dónde debemos sacrificar la privacidad por la seguridad?",
    description:
      "Vigilancia masiva, reconocimiento facial, datos personales... Gobiernos y empresas argumentan que es por nuestra seguridad. ¿Pero hasta qué punto es esto aceptable?",
    tags: ["privacidad", "seguridad", "derechos-digitales"],
    language: "es",
  },
  {
    slug: "dieta-vegetariana-mas-saludable-es",
    title: "¿La dieta vegetariana es realmente más saludable?",
    description:
      "Hay quienes defienden que una dieta sin carne es más saludable y sostenible. Otros argumentan que necesitamos proteína animal. ¿Qué dicen los estudios científicos?",
    tags: ["salud", "alimentación", "vegetarianismo"],
    language: "es",
  },
  {
    slug: "redes-sociales-salud-mental-es",
    title: "¿Las redes sociales perjudican nuestra salud mental?",
    description:
      "Estudios muestran correlación entre el uso de redes sociales y problemas de salud mental, especialmente en jóvenes. ¿Pero son las redes la causa o solo un reflejo de otros problemas?",
    tags: ["salud-mental", "redes-sociales", "tecnología"],
    language: "es",
  },
  {
    slug: "inteligencia-artificial-etica-es",
    title: "¿Cómo garantizar que la IA se desarrolle éticamente?",
    description:
      "La IA está avanzando rápidamente, pero cuestiones éticas como sesgo algorítmico, uso militar e impacto en el empleo son preocupantes. ¿Cómo podemos garantizar un desarrollo responsable?",
    tags: ["ia", "ética", "tecnología", "sociedad"],
    language: "es",
  },
];

// Temas em Francês (fr)
const topicsFr: TopicData[] = [
  {
    slug: "ia-remplacera-programmeurs-fr",
    title: "L'IA va-t-elle remplacer les programmeurs?",
    description:
      "Avec l'avancement d'outils comme ChatGPT et GitHub Copilot, il y a une discussion croissante sur l'avenir de la profession de programmeur. L'IA va-t-elle complètement remplacer les développeurs ou simplement changer notre façon de travailler?",
    tags: ["technologie", "ia", "programmation", "futur"],
    language: "fr",
  },
  {
    slug: "travail-distance-vs-bureau-fr",
    title: "Travail à distance vs bureau: lequel est le meilleur?",
    description:
      "Après la pandémie, de nombreuses entreprises ont adopté le travail à distance. Mais est-ce vraiment mieux pour tout le monde? Discutons des avantages et inconvénients de chaque modèle.",
    tags: ["travail", "productivité", "carrière"],
    language: "fr",
  },
  {
    slug: "meilleur-framework-javascript-2024-fr",
    title: "Quel est le meilleur framework JavaScript en 2024?",
    description:
      "React, Vue, Angular, Svelte, Solid... Tant d'options! Quel est selon vous le meilleur framework JavaScript pour démarrer de nouveaux projets en 2024?",
    tags: ["javascript", "frameworks", "développement-web"],
    language: "fr",
  },
  {
    slug: "cryptomonnaies-futur-ou-bulle-fr",
    title: "Les cryptomonnaies sont-elles l'avenir ou juste une bulle?",
    description:
      "Bitcoin, Ethereum et autres cryptomonnaies promettent de révolutionner le système financier. Mais sont-elles vraiment l'avenir de l'argent ou sommes-nous dans une bulle spéculative?",
    tags: ["cryptomonnaie", "finance", "technologie", "blockchain"],
    language: "fr",
  },
  {
    slug: "changement-climatique-action-individuelle-fr",
    title: "Changement climatique: que pouvons-nous faire individuellement?",
    description:
      "Le changement climatique est une réalité. Mais quelles actions individuelles font vraiment la différence? Vaut-il la peine de changer les habitudes personnelles ou le problème est-il plus systémique?",
    tags: ["climat", "environnement", "durabilité"],
    language: "fr",
  },
  {
    slug: "education-ligne-vs-presentielle-fr",
    title: "L'éducation en ligne est-elle aussi efficace que l'enseignement en classe?",
    description:
      "Les plateformes d'apprentissage en ligne ont beaucoup grandi ces dernières années. Mais l'apprentissage à distance est-il aussi efficace que l'enseignement en classe traditionnel?",
    tags: ["éducation", "en-ligne", "apprentissage"],
    language: "fr",
  },
  {
    slug: "vie-privee-vs-securite-numerique-fr",
    title: "Jusqu'où devons-nous sacrifier la vie privée pour la sécurité?",
    description:
      "Surveillance de masse, reconnaissance faciale, données personnelles... Les gouvernements et les entreprises affirment que c'est pour notre sécurité. Mais jusqu'où est-ce acceptable?",
    tags: ["vie-privée", "sécurité", "droits-numériques"],
    language: "fr",
  },
  {
    slug: "regime-vegetarien-plus-sain-fr",
    title: "Le régime végétarien est-il vraiment plus sain?",
    description:
      "Certains soutiennent qu'un régime sans viande est plus sain et plus durable. D'autres affirment que nous avons besoin de protéines animales. Que disent les études scientifiques?",
    tags: ["santé", "alimentation", "végétarisme"],
    language: "fr",
  },
  {
    slug: "reseaux-sociaux-sante-mentale-fr",
    title: "Les réseaux sociaux nuisent-ils à notre santé mentale?",
    description:
      "Des études montrent une corrélation entre l'utilisation des réseaux sociaux et les problèmes de santé mentale, en particulier chez les jeunes. Mais les réseaux sociaux sont-ils la cause ou juste un reflet d'autres problèmes?",
    tags: ["santé-mentale", "réseaux-sociaux", "technologie"],
    language: "fr",
  },
  {
    slug: "intelligence-artificielle-ethique-fr",
    title: "Comment garantir que l'IA soit développée de manière éthique?",
    description:
      "L'IA progresse rapidement, mais les questions éthiques comme le biais algorithmique, l'usage militaire et l'impact sur l'emploi sont préoccupantes. Comment pouvons-nous garantir un développement responsable?",
    tags: ["ia", "éthique", "technologie", "société"],
    language: "fr",
  },
];

// Temas em Alemão (de)
const topicsDe: TopicData[] = [
  {
    slug: "ki-ersetzt-programmierer-de",
    title: "Wird KI Programmierer ersetzen?",
    description:
      "Mit dem Fortschritt von Tools wie ChatGPT und GitHub Copilot gibt es eine wachsende Diskussion über die Zukunft des Programmierberufs. Wird KI Entwickler vollständig ersetzen oder nur unsere Arbeitsweise verändern?",
    tags: ["technologie", "ki", "programmierung", "zukunft"],
    language: "de",
  },
  {
    slug: "remote-vs-buero-arbeit-de",
    title: "Remote-Arbeit vs Büro: Was ist besser?",
    description:
      "Nach der Pandemie haben viele Unternehmen Remote-Arbeit eingeführt. Aber ist es wirklich besser für alle? Lassen Sie uns die Vor- und Nachteile jedes Modells diskutieren.",
    tags: ["arbeit", "produktivität", "karriere"],
    language: "de",
  },
  {
    slug: "bestes-javascript-framework-2024-de",
    title: "Was ist das beste JavaScript-Framework in 2024?",
    description:
      "React, Vue, Angular, Svelte, Solid... So viele Optionen! Was ist Ihrer Meinung nach das beste JavaScript-Framework für neue Projekte in 2024?",
    tags: ["javascript", "frameworks", "webentwicklung"],
    language: "de",
  },
  {
    slug: "kryptowaehrungen-zukunft-oder-blase-de",
    title: "Sind Kryptowährungen die Zukunft oder nur eine Blase?",
    description:
      "Bitcoin, Ethereum und andere Kryptowährungen versprechen, das Finanzsystem zu revolutionieren. Aber sind sie wirklich die Zukunft des Geldes oder befinden wir uns in einer spekulativen Blase?",
    tags: ["kryptowährung", "finanzen", "technologie", "blockchain"],
    language: "de",
  },
  {
    slug: "klimawandel-individuelle-aktion-de",
    title: "Klimawandel: Was können wir individuell tun?",
    description:
      "Der Klimawandel ist eine Realität. Aber welche individuellen Aktionen machen wirklich einen Unterschied? Lohnt es sich, persönliche Gewohnheiten zu ändern oder ist das Problem systemischer?",
    tags: ["klima", "umwelt", "nachhaltigkeit"],
    language: "de",
  },
  {
    slug: "online-vs-praesenz-bildung-de",
    title: "Ist Online-Bildung so effektiv wie Präsenzunterricht?",
    description:
      "Online-Lernplattformen sind in den letzten Jahren stark gewachsen. Aber ist Fernunterricht so effektiv wie traditioneller Präsenzunterricht?",
    tags: ["bildung", "online", "lernen"],
    language: "de",
  },
  {
    slug: "privatsphaere-vs-sicherheit-digital-de",
    title: "Wie weit sollten wir Privatsphäre für Sicherheit opfern?",
    description:
      "Massenüberwachung, Gesichtserkennung, persönliche Daten... Regierungen und Unternehmen argumentieren, es sei für unsere Sicherheit. Aber wie weit ist das akzeptabel?",
    tags: ["privatsphäre", "sicherheit", "digitale-rechte"],
    language: "de",
  },
  {
    slug: "vegetarische-ernaehrung-gesuender-de",
    title: "Ist eine vegetarische Ernährung wirklich gesünder?",
    description:
      "Einige argumentieren, dass eine fleischlose Ernährung gesünder und nachhaltiger ist. Andere argumentieren, dass wir tierisches Protein brauchen. Was sagen wissenschaftliche Studien?",
    tags: ["gesundheit", "ernährung", "vegetarismus"],
    language: "de",
  },
  {
    slug: "soziale-medien-psychische-gesundheit-de",
    title: "Schaden soziale Medien unserer psychischen Gesundheit?",
    description:
      "Studien zeigen eine Korrelation zwischen der Nutzung sozialer Medien und psychischen Gesundheitsproblemen, insbesondere bei jungen Menschen. Aber sind soziale Medien die Ursache oder nur ein Spiegelbild anderer Probleme?",
    tags: ["psychische-gesundheit", "soziale-medien", "technologie"],
    language: "de",
  },
  {
    slug: "kuenstliche-intelligenz-ethik-de",
    title: "Wie kann man sicherstellen, dass KI ethisch entwickelt wird?",
    description:
      "KI entwickelt sich schnell, aber ethische Fragen wie algorithmische Voreingenommenheit, militärische Nutzung und Auswirkungen auf die Beschäftigung sind besorgniserregend. Wie können wir eine verantwortungsvolle Entwicklung gewährleisten?",
    tags: ["ki", "ethik", "technologie", "gesellschaft"],
    language: "de",
  },
];

async function main() {
  console.log("🌱 Seeding database with multilingual topics...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.vote.deleteMany();
  await prisma.topicVote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.user.deleteMany();

  // Create password hash
  const passwordHash = await bcrypt.hash("password123", 12);

  // Create users
  console.log("👥 Creating users...");
  const admin = await prisma.user.create({
    data: {
      email: "admin@thebatee.com",
      username: "admin",
      name: "Admin User",
      passwordHash,
      role: "ADMIN",
      isOwner: true,
      preferredLanguage: "en",
    },
  });

  const mod = await prisma.user.create({
    data: {
      email: "mod@thebatee.com",
      username: "moderator",
      name: "Moderator",
      passwordHash,
      role: "MOD",
      preferredLanguage: "en",
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "maria@example.com",
        username: "maria_silva",
        name: "Maria Silva",
        passwordHash,
        preferredLanguage: "pt",
      },
    }),
    prisma.user.create({
      data: {
        email: "john@example.com",
        username: "john_smith",
        name: "John Smith",
        passwordHash,
        preferredLanguage: "en",
      },
    }),
    prisma.user.create({
      data: {
        email: "carlos@example.com",
        username: "carlos_garcia",
        name: "Carlos García",
        passwordHash,
        preferredLanguage: "es",
      },
    }),
    prisma.user.create({
      data: {
        email: "marie@example.com",
        username: "marie_dubois",
        name: "Marie Dubois",
        passwordHash,
        preferredLanguage: "fr",
      },
    }),
    prisma.user.create({
      data: {
        email: "hans@example.com",
        username: "hans_mueller",
        name: "Hans Müller",
        passwordHash,
        preferredLanguage: "de",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length + 2} users`);

  // Create all topics from all languages
  console.log("📝 Creating topics in all languages...");
  const allTopics = [...topicsPt, ...topicsEn, ...topicsEs, ...topicsFr, ...topicsDe];

  let createdCount = 0;
  for (const topic of allTopics) {
    // Assign user based on language
    let userId: string;
    if (topic.language === "pt")
      userId = users[0].id; // Maria Silva
    else if (topic.language === "en")
      userId = users[1].id; // John Smith
    else if (topic.language === "es")
      userId = users[2].id; // Carlos García
    else if (topic.language === "fr")
      userId = users[3].id; // Marie Dubois
    else userId = users[4].id; // Hans Müller

    await prisma.topic.create({
      data: {
        slug: topic.slug,
        title: topic.title,
        description: topic.description,
        tags: topic.tags,
        language: topic.language,
        createdById: userId,
      },
    });
    createdCount++;

    // Show progress
    if (createdCount % 10 === 0) {
      console.log(`   📊 Created ${createdCount}/${allTopics.length} topics...`);
    }
  }

  console.log(`✅ Created ${allTopics.length} topics across 5 languages`);
  console.log(`   🇵🇹 Portuguese: ${topicsPt.length} topics`);
  console.log(`   🇬🇧 English: ${topicsEn.length} topics`);
  console.log(`   🇪🇸 Spanish: ${topicsEs.length} topics`);
  console.log(`   🇫🇷 French: ${topicsFr.length} topics`);
  console.log(`   🇩🇪 German: ${topicsDe.length} topics`);

  console.log("✨ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
