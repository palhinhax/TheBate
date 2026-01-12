import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🎬 Creating 'Best of All Time' multi-choice topics...");

  // Find or create a seed user for these topics
  let seedUser = await prisma.user.findFirst({
    where: { isSeed: true },
  });

  if (!seedUser) {
    seedUser = await prisma.user.create({
      data: {
        email: "seed@thebate.com",
        username: "thebate_curator",
        name: "TheBate Curator",
        isSeed: true,
        emailVerified: new Date(),
        passwordHash: "$2a$10$dummyHashForSeedUser1234567890abcdefghijklmnopqrstuv",
        preferredLanguage: "en",
        preferredContentLanguages: ["en", "pt", "es", "fr", "de"],
      },
    });
  }

  // Topics to create in all languages
  const topicsData = [
    {
      slug: {
        en: "best-movie-of-all-time",
        pt: "melhor-filme-de-sempre",
        es: "mejor-pelicula-de-todos-los-tiempos",
        fr: "meilleur-film-de-tous-les-temps",
        de: "bester-film-aller-zeiten",
      },
      title: {
        en: "What is the best movie of all time?",
        pt: "Qual é o melhor filme de sempre?",
        es: "¿Cuál es la mejor película de todos los tiempos?",
        fr: "Quel est le meilleur film de tous les temps ?",
        de: "Was ist der beste Film aller Zeiten?",
      },
      description: {
        en: "Vote for the greatest cinematic masterpiece ever created. From classics to modern blockbusters, which film stands above all others?",
        pt: "Vota na maior obra-prima cinematográfica de sempre. Dos clássicos aos êxitos modernos, qual filme se destaca acima de todos?",
        es: "Vota por la obra maestra cinematográfica más grande jamás creada. Desde clásicos hasta éxitos modernos, ¿qué película destaca sobre todas las demás?",
        fr: "Votez pour le plus grand chef-d'œuvre cinématographique jamais créé. Des classiques aux blockbusters modernes, quel film se démarque au-dessus de tous ?",
        de: "Stimme für das größte Meisterwerk der Filmgeschichte. Von Klassikern bis zu modernen Blockbustern, welcher Film steht über allen anderen?",
      },
      tags: ["cinema", "movies", "entertainment", "culture"],
      options: [
        {
          label: "The Godfather",
          description: "Francis Ford Coppola's 1972 epic crime drama about the Corleone family.",
        },
        {
          label: "The Shawshank Redemption",
          description: "Frank Darabont's 1994 drama about hope and friendship in prison.",
        },
        {
          label: "Pulp Fiction",
          description: "Quentin Tarantino's 1994 neo-noir crime film with intertwining stories.",
        },
        {
          label: "The Dark Knight",
          description: "Christopher Nolan's 2008 superhero film redefining the genre.",
        },
        {
          label: "Schindler's List",
          description: "Steven Spielberg's 1993 historical drama about the Holocaust.",
        },
        {
          label: "Citizen Kane",
          description: "Orson Welles's 1941 masterpiece revolutionizing cinema technique.",
        },
      ],
    },
    {
      slug: {
        en: "best-tv-series-of-all-time",
        pt: "melhor-serie-de-sempre",
        es: "mejor-serie-de-todos-los-tiempos",
        fr: "meilleure-serie-de-tous-les-temps",
        de: "beste-serie-aller-zeiten",
      },
      title: {
        en: "What is the best TV series of all time?",
        pt: "Qual é a melhor série de sempre?",
        es: "¿Cuál es la mejor serie de todos los tiempos?",
        fr: "Quelle est la meilleure série de tous les temps ?",
        de: "Was ist die beste Serie aller Zeiten?",
      },
      description: {
        en: "From groundbreaking dramas to unforgettable comedies, which television series deserves the crown as the greatest ever made?",
        pt: "Dos dramas inovadores às comédias inesquecíveis, qual série de televisão merece a coroa como a melhor de sempre?",
        es: "Desde dramas innovadores hasta comedias inolvidables, ¿qué serie de televisión merece la corona como la mejor jamás realizada?",
        fr: "Des drames révolutionnaires aux comédies inoubliables, quelle série télévisée mérite la couronne comme la meilleure jamais réalisée ?",
        de: "Von bahnbrechenden Dramen bis zu unvergesslichen Komödien, welche Fernsehserie verdient die Krone als beste aller Zeiten?",
      },
      tags: ["tv", "series", "entertainment", "television"],
      options: [
        {
          label: "Breaking Bad",
          description: "Vince Gilligan's intense drama about a chemistry teacher turned drug lord.",
        },
        {
          label: "The Sopranos",
          description: "David Chase's revolutionary mob drama that changed television forever.",
        },
        {
          label: "Game of Thrones",
          description: "Epic fantasy series based on George R.R. Martin's novels.",
        },
        {
          label: "The Wire",
          description: "David Simon's gritty portrayal of Baltimore's drug scene and institutions.",
        },
        {
          label: "Friends",
          description: "Iconic sitcom about six friends navigating life in New York City.",
        },
        {
          label: "The Office (US)",
          description: "Mockumentary sitcom about everyday office life at Dunder Mifflin.",
        },
      ],
    },
    {
      slug: {
        en: "greatest-athlete-of-all-time",
        pt: "maior-atleta-de-sempre",
        es: "mejor-atleta-de-todos-los-tiempos",
        fr: "meilleur-athlete-de-tous-les-temps",
        de: "groesster-athlet-aller-zeiten",
      },
      title: {
        en: "Who is the greatest athlete of all time?",
        pt: "Quem é o maior atleta de sempre?",
        es: "¿Quién es el mejor atleta de todos los tiempos?",
        fr: "Qui est le meilleur athlète de tous les temps ?",
        de: "Wer ist der größte Athlet aller Zeiten?",
      },
      description: {
        en: "Across all sports and eras, who stands as the most exceptional athlete in history? Consider dominance, longevity, and impact on their sport.",
        pt: "Em todos os desportos e épocas, quem se destaca como o atleta mais excecional da história? Considera domínio, longevidade e impacto no seu desporto.",
        es: "En todos los deportes y épocas, ¿quién destaca como el atleta más excepcional de la historia? Considera dominio, longevidad e impacto en su deporte.",
        fr: "À travers tous les sports et toutes les époques, qui se distingue comme l'athlète le plus exceptionnel de l'histoire ? Considérez la domination, la longévité et l'impact sur leur sport.",
        de: "Über alle Sportarten und Epochen hinweg, wer gilt als der außergewöhnlichste Athlet der Geschichte? Berücksichtige Dominanz, Langlebigkeit und Einfluss auf ihre Sportart.",
      },
      tags: ["sports", "athletes", "competition", "excellence"],
      options: [
        {
          label: "Michael Jordan",
          description: "Basketball legend with 6 NBA championships and cultural icon.",
        },
        {
          label: "Muhammad Ali",
          description: "Boxing champion who transcended sport to become a global figure.",
        },
        {
          label: "Serena Williams",
          description: "Tennis powerhouse with 23 Grand Slam singles titles.",
        },
        {
          label: "Cristiano Ronaldo",
          description: "Football superstar with unmatched longevity and goal-scoring records.",
        },
        {
          label: "Lionel Messi",
          description: "Football genius with record-breaking 8 Ballon d'Or awards.",
        },
        {
          label: "Usain Bolt",
          description: "Sprinting legend holding world records in 100m and 200m.",
        },
      ],
    },
    {
      slug: {
        en: "best-us-president-of-all-time",
        pt: "melhor-presidente-eua-de-sempre",
        es: "mejor-presidente-eeuu-de-todos-los-tiempos",
        fr: "meilleur-president-usa-de-tous-les-temps",
        de: "bester-us-praesident-aller-zeiten",
      },
      title: {
        en: "Who was the best U.S. President of all time?",
        pt: "Quem foi o melhor Presidente dos EUA de sempre?",
        es: "¿Quién fue el mejor presidente de EE.UU. de todos los tiempos?",
        fr: "Qui était le meilleur président des États-Unis de tous les temps ?",
        de: "Wer war der beste US-Präsident aller Zeiten?",
      },
      description: {
        en: "From the founding fathers to modern leaders, which U.S. President had the greatest positive impact on the nation and the world?",
        pt: "Dos pais fundadores aos líderes modernos, qual Presidente dos EUA teve o maior impacto positivo na nação e no mundo?",
        es: "Desde los padres fundadores hasta los líderes modernos, ¿qué presidente de EE.UU. tuvo el mayor impacto positivo en la nación y el mundo?",
        fr: "Des pères fondateurs aux dirigeants modernes, quel président des États-Unis a eu le plus grand impact positif sur la nation et le monde ?",
        de: "Von den Gründervätern bis zu modernen Führern, welcher US-Präsident hatte den größten positiven Einfluss auf die Nation und die Welt?",
      },
      tags: ["politics", "history", "usa", "leadership"],
      options: [
        {
          label: "Abraham Lincoln",
          description: "Led the nation through Civil War and abolished slavery.",
        },
        {
          label: "George Washington",
          description: "First president who established precedents for the office.",
        },
        {
          label: "Franklin D. Roosevelt",
          description: "Guided America through Great Depression and World War II.",
        },
        {
          label: "Thomas Jefferson",
          description: "Author of Declaration of Independence and Louisiana Purchase.",
        },
        {
          label: "Theodore Roosevelt",
          description: "Progressive reformer and conservationist who modernized America.",
        },
        {
          label: "John F. Kennedy",
          description: "Inspired generation with vision for space exploration and civil rights.",
        },
      ],
    },
  ];

  // Create topics in all languages
  for (const topicData of topicsData) {
    for (const lang of ["en", "pt", "es", "fr", "de"] as const) {
      const existingTopic = await prisma.topic.findUnique({
        where: { slug: topicData.slug[lang] },
      });

      if (existingTopic) {
        console.log(`⏭️  Topic already exists: ${topicData.slug[lang]} (${lang})`);
        continue;
      }

      const topic = await prisma.topic.create({
        data: {
          slug: topicData.slug[lang],
          title: topicData.title[lang],
          description: topicData.description[lang],
          type: "MULTI_CHOICE",
          allowMultipleVotes: false,
          maxChoices: 1,
          language: lang,
          tags: topicData.tags,
          createdById: seedUser.id,
          status: "ACTIVE",
        },
      });

      // Create options for this topic
      for (let i = 0; i < topicData.options.length; i++) {
        await prisma.topicOption.create({
          data: {
            label: topicData.options[i].label,
            description: topicData.options[i].description,
            order: i,
            topicId: topic.id,
          },
        });
      }

      console.log(
        `✅ Created topic: ${topicData.slug[lang]} (${lang}) with ${topicData.options.length} options`
      );
    }
  }

  console.log("\n🎉 Finished creating 'Best of All Time' topics!");
  console.log(
    `📊 Created ${topicsData.length} topics × 5 languages = ${topicsData.length * 5} total topics`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
