import { NextRequest } from "next/server";

// Built-in AI coach — no external API needed, fully free
// Smart rule-based system with SMART goal support and motivational coaching

type Lang = "nl" | "en";

interface Rule {
  keywords: string[];
  response: Record<Lang, string>;
}

const RULES: Rule[] = [
  {
    keywords: ["smart", "doel stellen", "set goal", "goal setting", "doelen stellen"],
    response: {
      nl: `Laten we een SMART doel opstellen! 🎯

**S — Specifiek:** Wat wil je precies bereiken? (niet "fitter worden" maar "3x per week 30 min sporten")

**M — Meetbaar:** Hoe meet je je voortgang? (kg, km, punten, dagen)

**A — Haalbaar:** Is het realistisch met je huidige leven?

**R — Relevant:** Waarom is dit doel belangrijk voor jou?

**T — Tijdgebonden:** Wanneer wil je dit bereiken?

Vertel me meer over jouw doel en ik help je het SMART te maken! 💪`,
      en: `Let's create a SMART goal! 🎯

**S — Specific:** What exactly do you want to achieve? (not "get fit" but "work out 3x a week for 30 min")

**M — Measurable:** How will you track progress? (kg, km, points, days)

**A — Achievable:** Is it realistic with your current life?

**R — Relevant:** Why does this goal matter to you?

**T — Time-bound:** When do you want to achieve this?

Tell me more about your goal and I'll help you make it SMART! 💪`,
    },
  },
  {
    keywords: ["gemotiveerd", "motivatie", "motivated", "motivation", "motiveren"],
    response: {
      nl: `Motivatie komt en gaat — **discipline blijft**. 🔥

Hier zijn 3 bewezen tips:

1. **Maak het klein** — begin met 2 minuten. Serieus. 2 minuten sporten is beter dan 0 minuten.
2. **Koppel het aan iets** — na je koffie → 10 push-ups. Routine creëert automatisme.
3. **Track je streak** — jij hebt al een streak bezig. Breek hem niet! Dat gevoel is krachtiger dan motivatie.

Je hoeft je niet goed te voelen om te beginnen. Begin gewoon, het gevoel volgt.`,
      en: `Motivation comes and goes — **discipline stays**. 🔥

Here are 3 proven tips:

1. **Make it tiny** — start with 2 minutes. Seriously. 2 minutes of exercise beats 0 minutes.
2. **Attach it to something** — after your coffee → 10 push-ups. Routine creates automatism.
3. **Track your streak** — you already have a streak going. Don't break it! That feeling is more powerful than motivation.

You don't need to feel good to start. Just start, the feeling follows.`,
    },
  },
  {
    keywords: ["fitness", "sporten", "workout", "gym", "training", "sport"],
    response: {
      nl: `Fitness SMART aanpakken 💪

**Beginner routine (3x/week):**
- Ma: 20 min wandelen + 3x10 push-ups
- Wo: 20 min wandelen + 3x10 squats
- Vr: 30 min actieve rust (fietsen, zwemmen)

**Sleutel:** Consistentie > Intensiteit. Elke week een klein beetje meer.

Tip: Voeg je workouts toe als taak in de app met hoge prioriteit → +20 BOM-Coins per sessie! 🎯`,
      en: `Fitness the SMART way 💪

**Beginner routine (3x/week):**
- Mon: 20 min walk + 3x10 push-ups
- Wed: 20 min walk + 3x10 squats
- Fri: 30 min active rest (cycling, swimming)

**Key:** Consistency > Intensity. A little more each week.

Tip: Add your workouts as tasks in the app with high priority → +20 BOM-Coins per session! 🎯`,
    },
  },
  {
    keywords: ["geld", "money", "financiën", "finance", "sparen", "save", "budget", "inkomen", "income"],
    response: {
      nl: `Financiële discipline opbouwen 💰

**De 50/30/20 regel:**
- 50% voor vaste lasten (huur, eten, transport)
- 30% voor wensen (uitgaan, kleren, fun)
- 20% voor sparen & investeren

**Direct actie:**
1. Noteer vandaag elke uitgave (gewoon in Notes of een app)
2. Stel een maandelijks spaardoel in (start klein: €50/maand)
3. Automatiseer het — zet geld weg op spaardag

Kleine gewoonten × 365 dagen = groot resultaat. 📈`,
      en: `Building financial discipline 💰

**The 50/30/20 rule:**
- 50% for fixed costs (rent, food, transport)
- 30% for wants (going out, clothes, fun)
- 20% for saving & investing

**Immediate action:**
1. Track every expense today (just in Notes or an app)
2. Set a monthly savings goal (start small: €50/month)
3. Automate it — transfer money on payday

Small habits × 365 days = big results. 📈`,
    },
  },
  {
    keywords: ["school", "studie", "study", "examen", "exam", "leren", "learn", "resultaten"],
    response: {
      nl: `School aanpakken als een pro 📚

**De Pomodoro techniek:**
- 25 min gefocust studeren
- 5 min pauze
- Na 4 rondes: 20 min grote pauze

**Slim studeren:**
1. Actief leren > passief lezen (schrijf samen, maak oefenvragen)
2. Spaced repetition — herhaal stof op dag 1, 3, 7, 21
3. Slaap is ook studeren — je hersenen consolideren 's nachts

Maak van elke studiesessie een taak in de app! 🎯`,
      en: `Crushing school like a pro 📚

**The Pomodoro technique:**
- 25 min focused studying
- 5 min break
- After 4 rounds: 20 min long break

**Smart studying:**
1. Active learning > passive reading (summarize, make practice questions)
2. Spaced repetition — review material on day 1, 3, 7, 21
3. Sleep is studying too — your brain consolidates at night

Add each study session as a task in the app! 🎯`,
    },
  },
  {
    keywords: ["routine", "dag", "day", "ochend", "morning", "schema", "schedule", "gewoonten", "habits"],
    response: {
      nl: `De perfecte ochtend routine ☀️ (30 min)

**5:00-5:05** — Water drinken, geen telefoon
**5:05-5:15** — 10 min bewegen (stretchen, push-ups)
**5:15-5:20** — 3 dingen opschrijven waar je dankbaar voor bent
**5:20-5:30** — Je belangrijkste taak van die dag plannen

**Waarom ochtend?** Wilskracht is 's ochtends het sterkst. Gebruik het voor je moeilijkste taak.

Zet dit als herhalende dagelijkse taak in de app! 💪`,
      en: `The perfect morning routine ☀️ (30 min)

**5:00-5:05** — Drink water, no phone
**5:05-5:15** — 10 min movement (stretching, push-ups)
**5:15-5:20** — Write 3 things you're grateful for
**5:20-5:30** — Plan your most important task of the day

**Why morning?** Willpower is strongest in the morning. Use it for your hardest task.

Set this as a recurring daily task in the app! 💪`,
    },
  },
  {
    keywords: ["consistent", "consistency", "discipline", "gewoontes", "habits", "volhouden", "keep going"],
    response: {
      nl: `Consistentie is jouw superkracht 🔥

**De 2-dag regel:** Mis nooit 2 dagen op rij. Eén dag missen kan. Twee dagen wordt een gewoonte.

**Identiteit > doelen:** Zeg niet "ik probeer te sporten". Zeg "ik ben iemand die sport". Kleine woorden, groot verschil.

**Systeem > motivatie:** Leg je sportkleren 's avonds klaar. Leg je boek op je kussen. Maak het onmogelijk om te vergeten.

Je streak in BestOfMe is je bewijs. Elke dag die je aanvinkt, bewijst je identiteit aan jezelf. 💪`,
      en: `Consistency is your superpower 🔥

**The 2-day rule:** Never miss 2 days in a row. Missing one day is okay. Two days becomes a habit.

**Identity > goals:** Don't say "I'm trying to work out." Say "I'm someone who works out." Small words, big difference.

**Systems > motivation:** Lay out your workout clothes the night before. Put your book on your pillow. Make it impossible to forget.

Your streak in BestOfMe is your proof. Every day you check off proves your identity to yourself. 💪`,
    },
  },
  {
    keywords: ["stress", "angst", "anxiety", "overwhelmed", "overweldigd", "rust", "calm", "mindset"],
    response: {
      nl: `Even ademen 🧘

Wanneer alles te veel wordt:

**Box breathing (60 sec):**
- Inademen 4 sec
- Vasthouden 4 sec
- Uitademen 4 sec
- Vasthouden 4 sec
- Herhaal 4x

**Dan:** schrijf letterlijk op wat je stress geeft. Alles eruit. Je hoofd is geen opbergplaats.

**Kies dan 1 ding** — wat is het kleinste eerste stapje dat je nu kunt zetten?

Groot probleem = veel kleine stappen. Begin met stap 1.`,
      en: `Let's breathe for a moment 🧘

When everything feels like too much:

**Box breathing (60 sec):**
- Inhale 4 sec
- Hold 4 sec
- Exhale 4 sec
- Hold 4 sec
- Repeat 4x

**Then:** write down everything stressing you. Get it all out. Your head is not storage.

**Then pick 1 thing** — what's the smallest first step you can take right now?

Big problem = many small steps. Start with step 1.`,
    },
  },
];

const FALLBACK: Record<Lang, string[]> = {
  nl: [
    "Goede vraag! 💡 De sleutel tot succes is simpel: kleine acties, elke dag. Wat is één ding dat je vandaag kunt doen om dichter bij je doel te komen?",
    "Interessant! Weet je wat ik heb geleerd? De mensen die het verst komen zijn niet de meest getalenteerden — ze zijn het meest consistent. Blijf gewoon gaan. 🔥",
    "Dat begrijp ik! Onthoud: vooruitgang is niet altijd zichtbaar, maar elke stap telt. Wat is je volgende concrete actie?",
    "Goede mindset! Het feit dat je deze vraag stelt betekent al dat je bezig bent. Dat is 90% van het werk. 💪 Vertel me meer, dan help ik je verder.",
  ],
  en: [
    "Great question! 💡 The key to success is simple: small actions, every day. What's one thing you can do today to get closer to your goal?",
    "Interesting! You know what I've learned? The people who go furthest aren't the most talented — they're the most consistent. Just keep going. 🔥",
    "I get that! Remember: progress isn't always visible, but every step counts. What's your next concrete action?",
    "Good mindset! The fact that you're asking this question means you're already working on it. That's 90% of the work. 💪 Tell me more and I'll help you further.",
  ],
};

function detectLanguage(text: string): Lang {
  const dutchWords = ["ik", "de", "het", "een", "en", "van", "in", "is", "dat", "op", "te", "wat", "hoe", "kan", "wil", "mijn", "voor", "met", "zijn", "maar"];
  const words = text.toLowerCase().split(/\s+/);
  const dutchCount = words.filter((w) => dutchWords.includes(w)).length;
  return dutchCount >= 1 ? "nl" : "en";
}

function findBestResponse(userMsg: string, historyLang?: Lang): { response: string; lang: Lang } {
  const lower = userMsg.toLowerCase();
  const lang: Lang = historyLang ?? detectLanguage(userMsg);

  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return { response: rule.response[lang], lang };
    }
  }

  const fallbacks = FALLBACK[lang];
  return {
    response: fallbacks[Math.floor(Math.random() * fallbacks.length)],
    lang,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { messages, language } = await req.json();
    const lastUserMsg = messages.filter((m: { role: string }) => m.role === "user").pop()?.content ?? "";
    const lang: Lang = (language as Lang) ?? detectLanguage(lastUserMsg);

    const { response } = findBestResponse(lastUserMsg, lang);

    // Small delay to feel more natural
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));

    return Response.json({ message: response });
  } catch {
    return Response.json({ message: "Probeer het opnieuw / Try again." }, { status: 500 });
  }
}
