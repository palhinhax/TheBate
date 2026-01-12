/**
 * Seed data generators for realistic multi-language users and comments
 */

export interface SeedUser {
  name: string;
  username: string;
  email: string;
  locale: string;
}

// Realistic names by locale
const names = {
  en: [
    "James Smith",
    "Emma Johnson",
    "Michael Williams",
    "Olivia Brown",
    "William Jones",
    "Sophia Davis",
    "Robert Miller",
    "Isabella Wilson",
    "David Moore",
    "Mia Taylor",
    "John Anderson",
    "Charlotte Thomas",
    "Daniel Jackson",
    "Amelia White",
    "Matthew Harris",
    "Harper Martin",
    "Christopher Thompson",
    "Evelyn Garcia",
    "Andrew Martinez",
    "Abigail Robinson",
  ],
  pt: [
    "João Silva",
    "Maria Santos",
    "António Costa",
    "Ana Pereira",
    "José Ferreira",
    "Teresa Rodrigues",
    "Manuel Alves",
    "Catarina Martins",
    "Carlos Sousa",
    "Sofia Gonçalves",
    "Francisco Fernandes",
    "Mariana Ribeiro",
    "Pedro Carvalho",
    "Inês Oliveira",
    "Miguel Lopes",
    "Rita Teixeira",
    "Rui Pinto",
    "Beatriz Mendes",
    "Nuno Dias",
    "Sara Araújo",
  ],
  es: [
    "Carlos García",
    "María Rodríguez",
    "José Martínez",
    "Ana López",
    "Antonio González",
    "Laura Hernández",
    "Manuel Pérez",
    "Carmen Sánchez",
    "Francisco Ramírez",
    "Isabel Torres",
    "David Flores",
    "Cristina Rivera",
    "Miguel Gómez",
    "Patricia Díaz",
    "Javier Morales",
    "Elena Jiménez",
    "Pablo Ruiz",
    "Marta Álvarez",
    "Luis Romero",
    "Rosa Navarro",
  ],
  fr: [
    "Pierre Martin",
    "Marie Bernard",
    "Jean Dubois",
    "Sophie Thomas",
    "Michel Robert",
    "Isabelle Richard",
    "Jacques Petit",
    "Catherine Durand",
    "Philippe Leroy",
    "Nathalie Moreau",
    "André Simon",
    "Françoise Laurent",
    "Alain Lefebvre",
    "Monique Michel",
    "Bernard Garcia",
    "Christine Girard",
    "René Dupont",
    "Sylvie Roux",
    "François Fontaine",
    "Martine Rousseau",
  ],
  de: [
    "Thomas Müller",
    "Maria Schmidt",
    "Hans Weber",
    "Anna Wagner",
    "Michael Becker",
    "Julia Fischer",
    "Peter Schulz",
    "Sabine Koch",
    "Wolfgang Hoffmann",
    "Petra Richter",
    "Klaus Klein",
    "Monika Wolf",
    "Jürgen Schröder",
    "Ute Neumann",
    "Dieter Schwarz",
    "Andrea Zimmermann",
    "Helmut Braun",
    "Karin Hofmann",
    "Günter Hartmann",
    "Angelika Schmitt",
  ],
  it: [
    "Mario Rossi",
    "Anna Russo",
    "Giuseppe Ferrari",
    "Maria Esposito",
    "Antonio Bianchi",
    "Laura Romano",
    "Francesco Colombo",
    "Elena Ricci",
    "Giovanni Marino",
    "Chiara Greco",
    "Paolo Costa",
    "Francesca Conti",
    "Marco Bruno",
    "Giulia De Luca",
    "Luigi Rizzo",
    "Valentina Moretti",
    "Andrea Barbieri",
    "Silvia Fontana",
    "Roberto Santoro",
    "Paola Ferrara",
  ],
};

// Generate username from name
function generateUsername(name: string, index: number): string {
  const parts = name.toLowerCase().split(" ");
  const base = parts.join("_");
  // Add suffix for uniqueness: maria_silva, maria_silva2, maria_silva3, etc.
  return `${base}${index > 0 ? index + 1 : ""}`;
}

// Generate email from username
function generateEmail(username: string, locale: string): string {
  const domains = {
    en: ["example.com", "mail.com", "email.com"],
    pt: ["exemplo.pt", "mail.pt", "email.pt"],
    es: ["ejemplo.es", "correo.es", "email.es"],
    fr: ["exemple.fr", "courriel.fr", "email.fr"],
    de: ["beispiel.de", "mail.de", "email.de"],
    it: ["esempio.it", "posta.it", "email.it"],
  };

  const domainList = domains[locale as keyof typeof domains] || domains.en;
  const domain = domainList[Math.floor(Math.random() * domainList.length)];
  return `${username}@${domain}`;
}

// Generate users for a specific locale
export function generateUsersForLocale(locale: string, count: number): SeedUser[] {
  const localeNames = names[locale as keyof typeof names] || names.en;
  const users: SeedUser[] = [];

  for (let i = 0; i < Math.min(count, localeNames.length); i++) {
    const name = localeNames[i];
    const username = generateUsername(name, i);
    const email = generateEmail(username, locale);

    users.push({ name, username, email, locale });
  }

  return users;
}

// Comment templates by language and opinion
export const commentTemplates = {
  en: {
    pro: [
      "This is exactly what we need. The benefits far outweigh the risks.",
      "I completely agree. This makes perfect sense from a practical standpoint.",
      "Finally someone who gets it. This is the logical conclusion.",
      "Absolutely. The evidence clearly supports this position.",
      "This is the right direction. We should have done this years ago.",
      "Spot on. Anyone who disagrees hasn't thought it through.",
      "Exactly my thoughts. This is the most reasonable approach.",
      "I've been saying this for years. Glad to see others catching on.",
      "This is common sense. I don't understand the opposition.",
      "Perfectly said. The alternatives are far worse.",
    ],
    contra: [
      "I strongly disagree. This overlooks major concerns.",
      "This is short-sighted. The long-term consequences could be severe.",
      "Not convinced at all. The assumptions here are questionable.",
      "This ignores the real issues. We need a different approach entirely.",
      "Hard pass. This creates more problems than it solves.",
      "I don't buy it. The evidence doesn't support this claim.",
      "This is naive thinking. Reality is far more complicated.",
      "Terrible idea. Has anyone thought about the implications?",
      "This won't work in practice. Too many variables are being ignored.",
      "I respectfully disagree. The risks are being underestimated.",
    ],
    neutral: [
      "It's more nuanced than that. Both sides have valid points.",
      "Depends on the context really. Not so black and white.",
      "I see merit in both arguments. The truth is probably somewhere in the middle.",
      "Not sure about this one. Need more information to decide.",
      "Could go either way. There are trade-offs to consider.",
      "Interesting perspective but I'm not fully convinced either way.",
      "This varies by situation. Hard to generalize.",
      "Maybe, but we need to consider all factors first.",
      "I'm on the fence. Both approaches have pros and cons.",
      "Fair points on both sides. The answer isn't obvious.",
    ],
  },
  pt: {
    pro: [
      "Concordo plenamente. Isto é exactamente o que precisamos.",
      "Finalmente alguém com senso comum. Apoio totalmente.",
      "Perfeito. As vantagens são evidentes.",
      "Exactamente o que penso. Devíamos ter feito isto há anos.",
      "Totalmente de acordo. A lógica é inegável.",
      "Bem dito. Quem discorda não está a ver o quadro completo.",
      "Isto é óbvio. Não percebo a oposição.",
      "Completamente certo. Os benefícios são claros.",
      "Ando a dizer isto há anos. Ainda bem que outros concordam.",
      "Faz todo o sentido. É a solução mais razoável.",
    ],
    contra: [
      "Discordo completamente. Isto ignora questões importantes.",
      "Não me convencem. Os riscos são demasiado elevados.",
      "Isto é demasiado simplista. A realidade é mais complexa.",
      "Péssima ideia. As consequências podem ser graves.",
      "Não concordo. As premissas estão erradas.",
      "Isto não vai funcionar na prática. Faltam dados.",
      "É uma visão muito limitada do problema.",
      "Discordo respeitosamente. Há alternativas melhores.",
      "Isto cria mais problemas do que resolve.",
      "Não é assim tão simples. Há muitas variáveis a considerar.",
    ],
    neutral: [
      "É mais complexo do que isso. Ambos os lados têm razão.",
      "Depende muito do contexto. Não é preto no branco.",
      "Há mérito em ambos os argumentos. A verdade está no meio.",
      "Não tenho a certeza. Preciso de mais informação.",
      "Pode ser das duas formas. Há compromissos a fazer.",
      "Perspectiva interessante mas não estou totalmente convencido.",
      "Isto varia conforme a situação. Difícil generalizar.",
      "Talvez, mas temos de considerar todos os factores.",
      "Estou indeciso. Ambas as abordagens têm prós e contras.",
      "Pontos válidos de ambos os lados. Não é óbvio.",
    ],
  },
  es: {
    pro: [
      "Totalmente de acuerdo. Esto es exactamente lo que necesitamos.",
      "Por fin alguien con sentido común. Apoyo completamente.",
      "Perfecto. Los beneficios son evidentes.",
      "Exactamente lo que pienso. Deberíamos haberlo hecho hace años.",
      "Completamente de acuerdo. La lógica es innegable.",
      "Bien dicho. Quien discrepa no ve el panorama completo.",
      "Esto es obvio. No entiendo la oposición.",
      "Totalmente correcto. Los beneficios son claros.",
      "Llevo años diciendo esto. Me alegro de que otros estén de acuerdo.",
      "Tiene todo el sentido. Es la solución más razonable.",
    ],
    contra: [
      "No estoy de acuerdo. Esto ignora cuestiones importantes.",
      "No me convence. Los riesgos son demasiado altos.",
      "Esto es demasiado simplista. La realidad es más compleja.",
      "Pésima idea. Las consecuencias pueden ser graves.",
      "No concuerdo. Las premisas están equivocadas.",
      "Esto no funcionará en la práctica. Faltan datos.",
      "Es una visión muy limitada del problema.",
      "Discrepo respetuosamente. Hay alternativas mejores.",
      "Esto crea más problemas de los que resuelve.",
      "No es tan simple. Hay muchas variables a considerar.",
    ],
    neutral: [
      "Es más complejo que eso. Ambos lados tienen razón.",
      "Depende mucho del contexto. No es blanco o negro.",
      "Hay mérito en ambos argumentos. La verdad está en el medio.",
      "No estoy seguro. Necesito más información.",
      "Puede ser de ambas formas. Hay compromisos que hacer.",
      "Perspectiva interesante pero no estoy totalmente convencido.",
      "Esto varía según la situación. Difícil generalizar.",
      "Quizás, pero hay que considerar todos los factores.",
      "Estoy indeciso. Ambos enfoques tienen pros y contras.",
      "Puntos válidos de ambos lados. No es obvio.",
    ],
  },
  fr: {
    pro: [
      "Tout à fait d'accord. C'est exactement ce qu'il nous faut.",
      "Enfin quelqu'un de sensé. Je soutiens complètement.",
      "Parfait. Les avantages sont évidents.",
      "Exactement ce que je pense. On aurait dû le faire il y a des années.",
      "Complètement d'accord. La logique est indéniable.",
      "Bien dit. Ceux qui contestent ne voient pas le tableau complet.",
      "C'est évident. Je ne comprends pas l'opposition.",
      "Totalement juste. Les bénéfices sont clairs.",
      "Je le dis depuis des années. Content que d'autres soient d'accord.",
      "Ça fait tout à fait sens. C'est la solution la plus raisonnable.",
    ],
    contra: [
      "Je ne suis pas d'accord. Cela ignore des questions importantes.",
      "Ça ne me convainc pas. Les risques sont trop élevés.",
      "C'est trop simpliste. La réalité est plus complexe.",
      "Mauvaise idée. Les conséquences peuvent être graves.",
      "Je ne suis pas d'accord. Les prémisses sont fausses.",
      "Ça ne marchera pas en pratique. Il manque des données.",
      "C'est une vision très limitée du problème.",
      "Je ne suis pas d'accord respectueusement. Il y a de meilleures alternatives.",
      "Cela crée plus de problèmes qu'il n'en résout.",
      "Ce n'est pas si simple. Il y a beaucoup de variables à considérer.",
    ],
    neutral: [
      "C'est plus complexe que ça. Les deux côtés ont raison.",
      "Ça dépend beaucoup du contexte. Ce n'est pas noir ou blanc.",
      "Il y a du mérite dans les deux arguments. La vérité est au milieu.",
      "Je ne suis pas sûr. J'ai besoin de plus d'informations.",
      "Ça peut être les deux. Il y a des compromis à faire.",
      "Perspective intéressante mais je ne suis pas totalement convaincu.",
      "Cela varie selon la situation. Difficile de généraliser.",
      "Peut-être, mais il faut considérer tous les facteurs.",
      "Je suis indécis. Les deux approches ont des avantages et des inconvénients.",
      "Des points valables des deux côtés. Ce n'est pas évident.",
    ],
  },
  de: {
    pro: [
      "Völlig einverstanden. Das ist genau das, was wir brauchen.",
      "Endlich jemand mit Verstand. Ich unterstütze das vollkommen.",
      "Perfekt. Die Vorteile sind offensichtlich.",
      "Genau das denke ich auch. Wir hätten das vor Jahren tun sollen.",
      "Völlig richtig. Die Logik ist unbestreitbar.",
      "Gut gesagt. Wer widerspricht, sieht nicht das große Ganze.",
      "Das ist offensichtlich. Ich verstehe die Opposition nicht.",
      "Total korrekt. Die Vorteile sind klar.",
      "Das sage ich schon seit Jahren. Schön, dass andere zustimmen.",
      "Macht absolut Sinn. Das ist die vernünftigste Lösung.",
    ],
    contra: [
      "Ich stimme nicht zu. Das ignoriert wichtige Fragen.",
      "Das überzeugt mich nicht. Die Risiken sind zu hoch.",
      "Das ist zu simpel. Die Realität ist komplexer.",
      "Schlechte Idee. Die Konsequenzen können gravierend sein.",
      "Ich bin anderer Meinung. Die Prämissen sind falsch.",
      "Das wird in der Praxis nicht funktionieren. Es fehlen Daten.",
      "Das ist eine sehr begrenzte Sicht des Problems.",
      "Ich widerspreche respektvoll. Es gibt bessere Alternativen.",
      "Das schafft mehr Probleme als es löst.",
      "So einfach ist es nicht. Es gibt viele Variablen zu bedenken.",
    ],
    neutral: [
      "Es ist komplexer als das. Beide Seiten haben Recht.",
      "Es hängt stark vom Kontext ab. Es ist nicht schwarz oder weiß.",
      "Beide Argumente haben Berechtigung. Die Wahrheit liegt in der Mitte.",
      "Ich bin nicht sicher. Ich brauche mehr Informationen.",
      "Es kann beides sein. Es gibt Kompromisse zu machen.",
      "Interessante Perspektive, aber ich bin nicht völlig überzeugt.",
      "Das variiert je nach Situation. Schwer zu verallgemeinern.",
      "Vielleicht, aber wir müssen alle Faktoren berücksichtigen.",
      "Ich bin unentschlossen. Beide Ansätze haben Vor- und Nachteile.",
      "Gültige Punkte auf beiden Seiten. Es ist nicht offensichtlich.",
    ],
  },
  it: {
    pro: [
      "Completamente d'accordo. È esattamente ciò di cui abbiamo bisogno.",
      "Finalmente qualcuno con buon senso. Supporto completamente.",
      "Perfetto. I vantaggi sono evidenti.",
      "Esattamente quello che penso. Avremmo dovuto farlo anni fa.",
      "Completamente giusto. La logica è innegabile.",
      "Ben detto. Chi dissente non vede il quadro completo.",
      "È ovvio. Non capisco l'opposizione.",
      "Totalmente corretto. I benefici sono chiari.",
      "Lo dico da anni. Sono contento che altri siano d'accordo.",
      "Ha perfettamente senso. È la soluzione più ragionevole.",
    ],
    contra: [
      "Non sono d'accordo. Questo ignora questioni importanti.",
      "Non mi convince. I rischi sono troppo alti.",
      "È troppo semplicistico. La realtà è più complessa.",
      "Pessima idea. Le conseguenze possono essere gravi.",
      "Non concordo. Le premesse sono sbagliate.",
      "Non funzionerà nella pratica. Mancano dati.",
      "È una visione molto limitata del problema.",
      "Dissento rispettosamente. Ci sono alternative migliori.",
      "Questo crea più problemi di quanti ne risolva.",
      "Non è così semplice. Ci sono molte variabili da considerare.",
    ],
    neutral: [
      "È più complesso di così. Entrambe le parti hanno ragione.",
      "Dipende molto dal contesto. Non è bianco o nero.",
      "C'è del merito in entrambi gli argomenti. La verità sta nel mezzo.",
      "Non sono sicuro. Ho bisogno di più informazioni.",
      "Può essere in entrambi i modi. Ci sono compromessi da fare.",
      "Prospettiva interessante ma non sono totalmente convinto.",
      "Varia a seconda della situazione. Difficile generalizzare.",
      "Forse, ma dobbiamo considerare tutti i fattori.",
      "Sono indeciso. Entrambi gli approcci hanno pro e contro.",
      "Punti validi da entrambe le parti. Non è ovvio.",
    ],
  },
};

// Get random comment for language and opinion
export function getRandomComment(language: string, opinion: "pro" | "contra" | "neutral"): string {
  const templates =
    commentTemplates[language as keyof typeof commentTemplates] || commentTemplates.en;
  const opinionTemplates = templates[opinion];
  return opinionTemplates[Math.floor(Math.random() * opinionTemplates.length)];
}

// Generate random date in range
export function randomDateInRange(startDaysAgo: number, endDaysAgo: number = 0): Date {
  const now = new Date();
  const start = new Date(now.getTime() - startDaysAgo * 24 * 60 * 60 * 1000);
  const end = new Date(now.getTime() - endDaysAgo * 24 * 60 * 60 * 1000);

  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Apply activity pattern (more at night and weekends)
export function adjustForActivityPattern(date: Date): Date {
  const adjusted = new Date(date);

  // 60% chance to adjust to peak hours (19:00-00:00)
  if (Math.random() < 0.6) {
    const peakHour = 19 + Math.floor(Math.random() * 5); // 19:00 to 23:59
    adjusted.setHours(peakHour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
  }

  // 40% chance to move to weekend if weekday
  if (Math.random() < 0.4 && adjusted.getDay() !== 0 && adjusted.getDay() !== 6) {
    const daysToWeekend = 6 - adjusted.getDay(); // Days until Saturday
    adjusted.setDate(adjusted.getDate() + daysToWeekend);
  }

  return adjusted;
}

// Long-tail distribution for votes (Pareto principle)
export function getLongTailVoteCount(maxVotes: number = 50): number {
  // Using exponential distribution for long-tail effect
  // Most comments get 0-3 votes, few get many
  const random = Math.random();
  if (random < 0.5) return 0; // 50% no votes
  if (random < 0.75) return 1; // 25% one vote
  if (random < 0.9) return Math.floor(Math.random() * 3) + 2; // 15% get 2, 3, or 4 votes
  if (random < 0.97) return Math.floor(Math.random() * 10) + 5; // 7% get 5-14 votes
  return Math.floor(Math.random() * (maxVotes - 15)) + 15; // 3% get 15+ votes
}
