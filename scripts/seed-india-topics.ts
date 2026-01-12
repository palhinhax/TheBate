import { prisma } from "../lib/prisma";

// Hot topics for India in Hindi
const indianTopics = [
  {
    title: "क्या भारत को UPI को वैश्विक स्तर पर विस्तारित करना चाहिए?",
    titleEn: "Should India expand UPI globally?",
    description:
      "यूनिफाइड पेमेंट्स इंटरफेस (UPI) ने भारत में डिजिटल भुगतान में क्रांति ला दी है। क्या भारत सरकार को अन्य देशों के साथ UPI तकनीक साझा करनी चाहिए और इसे वैश्विक भुगतान प्रणाली बनाना चाहिए?",
    descriptionEn:
      "UPI has revolutionized digital payments in India. Should the Indian government share UPI technology with other countries and make it a global payment system?",
    tags: ["india", "upi", "technology", "fintech", "payments"],
    language: "hi",
  },
  {
    title: "क्या भारत में स्टार्टअप्स को अधिक सरकारी सहायता मिलनी चाहिए?",
    titleEn: "Should startups in India get more government support?",
    description:
      "भारत दुनिया का तीसरा सबसे बड़ा स्टार्टअप इकोसिस्टम है। क्या सरकार को टैक्स में छूट, आसान नियामक प्रक्रिया और अधिक फंडिंग के माध्यम से स्टार्टअप्स को और अधिक समर्थन देना चाहिए?",
    descriptionEn:
      "India is the world's third-largest startup ecosystem. Should the government provide more support to startups through tax breaks, easier regulatory processes, and more funding?",
    tags: ["india", "startups", "business", "economy", "innovation"],
    language: "hi",
  },
  {
    title: "क्या भारत को अपनी शिक्षा प्रणाली में AI को अपनाना चाहिए?",
    titleEn: "Should India adopt AI in its education system?",
    description:
      "कृत्रिम बुद्धिमत्ता (AI) शिक्षा को व्यक्तिगत बना सकती है और सीखने के परिणामों में सुधार कर सकती है। क्या भारतीय स्कूलों और कॉलेजों को AI-आधारित शिक्षण उपकरण अपनाने चाहिए, या क्या इससे पारंपरिक शिक्षण विधियों को नुकसान होगा?",
    descriptionEn:
      "Artificial Intelligence can personalize education and improve learning outcomes. Should Indian schools and colleges adopt AI-based teaching tools, or will it harm traditional teaching methods?",
    tags: ["india", "education", "ai", "technology", "learning"],
    language: "hi",
  },
  {
    title: "क्या भारत को इलेक्ट्रिक वाहनों पर अधिक ध्यान देना चाहिए?",
    titleEn: "Should India focus more on electric vehicles?",
    description:
      "भारत सरकार 2030 तक 30% इलेक्ट्रिक वाहनों का लक्ष्य रखती है। क्या यह प्रदूषण और तेल आयात पर निर्भरता कम करने के लिए पर्याप्त है? क्या भारत को इलेक्ट्रिक वाहनों पर अधिक सब्सिडी देनी चाहिए?",
    descriptionEn:
      "The Indian government aims for 30% electric vehicles by 2030. Is this enough to reduce pollution and oil import dependency? Should India provide more subsidies for electric vehicles?",
    tags: ["india", "electric-vehicles", "environment", "climate", "transport"],
    language: "hi",
  },
  {
    title: "क्या भारत में क्रिप्टोकरेंसी को वैध बनाया जाना चाहिए?",
    titleEn: "Should cryptocurrency be legalized in India?",
    description:
      "भारत में क्रिप्टोकरेंसी की कानूनी स्थिति अस्पष्ट है। क्या सरकार को Bitcoin और अन्य क्रिप्टो को वैध बनाना चाहिए और उन्हें नियंत्रित करना चाहिए, या क्या उन्हें प्रतिबंधित रखना चाहिए?",
    descriptionEn:
      "The legal status of cryptocurrency in India is unclear. Should the government legalize Bitcoin and other cryptos and regulate them, or should they remain banned?",
    tags: ["india", "cryptocurrency", "bitcoin", "finance", "regulation"],
    language: "hi",
  },
  {
    title: "क्या भारत को 4-दिवसीय कार्य सप्ताह अपनाना चाहिए?",
    titleEn: "Should India adopt a 4-day work week?",
    description:
      "कई देश 4-दिवसीय कार्य सप्ताह का परीक्षण कर रहे हैं जिससे उत्पादकता और कर्मचारी कल्याण में सुधार हुआ है। क्या भारतीय कंपनियों को भी इसे लागू करना चाहिए, या क्या यह भारतीय अर्थव्यवस्था के लिए व्यावहारिक नहीं है?",
    descriptionEn:
      "Many countries are testing a 4-day work week with improvements in productivity and employee wellbeing. Should Indian companies also implement this, or is it impractical for the Indian economy?",
    tags: ["india", "work-life-balance", "employment", "productivity", "culture"],
    language: "hi",
  },
  {
    title: "क्या भारत में मुफ्त इंटरनेट एक मौलिक अधिकार होना चाहिए?",
    titleEn: "Should free internet be a fundamental right in India?",
    description:
      "डिजिटल युग में, इंटरनेट शिक्षा, रोजगार और सूचना तक पहुंच के लिए आवश्यक है। क्या भारत सरकार को सभी नागरिकों को मुफ्त या सस्ती इंटरनेट प्रदान करना चाहिए?",
    descriptionEn:
      "In the digital age, internet is essential for education, employment, and access to information. Should the Indian government provide free or affordable internet to all citizens?",
    tags: ["india", "internet", "digital-rights", "technology", "access"],
    language: "hi",
  },
  {
    title: "क्या भारतीय सिनेमा को अधिक विविधता की जरूरत है?",
    titleEn: "Does Indian cinema need more diversity?",
    description:
      "बॉलीवुड और अन्य भारतीय फिल्म उद्योग अक्सर कुछ ही प्रकार की कहानियों और अभिनेताओं पर ध्यान केंद्रित करते हैं। क्या भारतीय सिनेमा को विभिन्न संस्कृतियों, भाषाओं और पृष्ठभूमि के लोगों को अधिक प्रतिनिधित्व देना चाहिए?",
    descriptionEn:
      "Bollywood and other Indian film industries often focus on only certain types of stories and actors. Should Indian cinema give more representation to people from different cultures, languages, and backgrounds?",
    tags: ["india", "cinema", "bollywood", "culture", "diversity"],
    language: "hi",
  },
  {
    title: "क्या भारत में सोशल मीडिया को अधिक नियंत्रित किया जाना चाहिए?",
    titleEn: "Should social media be more regulated in India?",
    description:
      "फेक न्यूज, साइबर बुलिंग और गोपनीयता के मुद्दे भारत में बढ़ रहे हैं। क्या सरकार को Facebook, Twitter और WhatsApp जैसे प्लेटफार्मों पर सख्त नियम लागू करने चाहिए?",
    descriptionEn:
      "Fake news, cyberbullying, and privacy issues are growing in India. Should the government impose stricter regulations on platforms like Facebook, Twitter, and WhatsApp?",
    tags: ["india", "social-media", "regulation", "privacy", "misinformation"],
    language: "hi",
  },
  {
    title: "क्या भारत को अपनी अंतरिक्ष कार्यक्रम में अधिक निवेश करना चाहिए?",
    titleEn: "Should India invest more in its space program?",
    description:
      "ISRO ने कम लागत में बड़ी सफलता हासिल की है। क्या भारत को Chandrayaan, Gaganyaan और अन्य अंतरिक्ष मिशनों में अधिक धन निवेश करना चाहिए, या क्या यह पैसा अन्य प्राथमिकताओं पर खर्च होना चाहिए?",
    descriptionEn:
      "ISRO has achieved great success at low cost. Should India invest more money in Chandrayaan, Gaganyaan, and other space missions, or should this money be spent on other priorities?",
    tags: ["india", "space", "isro", "science", "innovation"],
    language: "hi",
  },
];

async function main() {
  console.log("🇮🇳 Creating Indian/Hindi topics...\n");

  // Find admin user (any user will work for now)
  const admin = await prisma.user.findFirst({
    where: {
      isOwner: true,
    },
  });

  if (!admin) {
    // Fallback to any admin user
    const anyAdmin = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });

    if (!anyAdmin) {
      console.error("❌ No admin user found. Please create an admin user first.");
      process.exit(1);
    }

    console.log(`✅ Using admin: ${anyAdmin.username || anyAdmin.email}\n`);

    await createTopics(anyAdmin.id);
    return;
  }

  console.log(`✅ Using owner: ${admin.username || admin.email}\n`);
  await createTopics(admin.id);
}

async function createTopics(userId: string) {
  for (const topicData of indianTopics) {
    // Check if topic already exists
    const slug = topicData.title
      .toLowerCase()
      .replace(/[^\u0900-\u097Fa-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await prisma.topic.findUnique({
      where: { slug },
    });

    if (existing) {
      console.log(`⏭️  Topic already exists: "${topicData.titleEn}"`);
      continue;
    }

    const topic = await prisma.topic.create({
      data: {
        slug,
        title: topicData.title,
        description: topicData.description,
        language: topicData.language,
        tags: topicData.tags,
        type: "YES_NO",
        status: "ACTIVE",
        createdById: userId,
      },
    });

    console.log(`✅ Created: "${topicData.titleEn}"`);
    console.log(`   ${topicData.title}`);
    console.log(`   URL: https://thebatee.com/t/${topic.slug}\n`);
  }

  console.log("✨ Hindi topics created successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
